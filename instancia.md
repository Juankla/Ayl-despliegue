# Dimensionamiento de EC2 para producción

## Resumen ejecutivo

Para este monorepositorio recomiendo empezar con **EC2 `t3.small` (2 vCPU, 2 GiB RAM)**, Ubuntu Server 24.04 LTS y un volumen raíz **EBS gp3 de 30 GiB**. Compila el frontend en CI o en una máquina de desarrollo y publica únicamente `dist/`; instala en el servidor solo las dependencias de producción del backend. Configura alertas de disco y memoria, rotación de logs y copias de seguridad fuera de la instancia.

`t3.small` es un mínimo razonable para una API de carga ligera y Nginx, no una garantía de capacidad para cualquier reporte o tasa de solicitudes. Para más margen operativo, reportes que procesan muchos registros o crecimiento esperado, elige **`t3.medium` (2 vCPU, 4 GiB)**. La instancia definitiva debe validarse con métricas de producción.

## 1. Almacenamiento EBS

El tamaño descargado de una imagen de Ubuntu no equivale al espacio que ocupará el sistema instalado. Como presupuesto inicial para Ubuntu Server 24.04 LTS y herramientas habituales:

| Componente | Presupuesto orientativo |
|---|---:|
| Ubuntu instalado, paquetes del sistema y actualizaciones | 3–6 GiB |
| Node.js 24 y npm | 0.15–0.35 GiB |
| Nginx, Git, PM2, Certbot y dependencias de sistema | 0.3–0.8 GiB |
| Código backend, sin datos ni respaldos grandes | 0.02–0.2 GiB |
| Dependencias de producción del backend | 0.1–0.5 GiB |
| Frontend compilado (`dist/`) | 0.01–0.2 GiB |
| Temporales de despliegue, cachés y margen para logs | 3–6 GiB |
| **Uso estimado inicial** | **aprox. 7–14 GiB** |

Son rangos para planificar, no mediciones del disco de una AMI concreta. El uso crece con actualizaciones, cachés, logs y artefactos retenidos. Certbot instalado con Snap, por ejemplo, puede consumir más que una instalación mínima mediante paquetes del sistema.

### Tamaños recomendados

- **20 GiB:** mínimo práctico si se mantiene el servidor limpio, los logs tienen rotación y no se compila allí.
- **30 GiB gp3:** recomendación inicial para producción; deja margen razonable sin guardar multimedia ni respaldos en el disco.
- **40 GiB o más:** si se compila en la instancia, se retienen despliegues/logs, o los datos locales crecen. Aumentar el volumen requiere revisar también el sistema de archivos.

gp3 incluye un rendimiento base de **3,000 IOPS y 125 MB/s** en cualquier tamaño de volumen, suficiente para este patrón de uso. Revisa [los detalles de EBS gp3](https://aws.amazon.com/ebs/general-purpose/) y los precios de la región elegida. No guardes en EBS las imágenes de Cloudinary ni respaldos históricos que deban residir en almacenamiento externo.

### Medidas de este checkout

Medición recursiva de los archivos presentes en el workspace al preparar esta guía:

| Ruta | Tamaño observado |
|---|---:|
| `backend/` | 11.28 MiB |
| `src/` (código fuente del frontend en este repo) | 0.51 MiB |
| `node_modules/` de la raíz | 344.41 MiB |
| `dist/` existente | 0.83 MiB |

Estos valores describen el árbol local, no el tamaño exacto que instalará Ubuntu. `backend/` incluye archivos de datos existentes; verifica que respaldos como `backend/backup_ayl_2026-10-28.json` no se desplieguen accidentalmente ni contengan información que no deba quedar en el servidor. La carpeta `node_modules/` local incluye dependencias de desarrollo y no es una medida de las dependencias de producción del backend. En este repositorio el frontend está en la raíz; no existe una carpeta `frontend/`.

## 2. RAM y CPU

Estimaciones orientativas para una instancia Linux recién iniciada y un único proceso de API. El consumo real depende de librerías, tráfico, tamaño de las respuestas y tareas de reportes.

| Proceso/carga | RAM orientativa |
|---|---:|
| Ubuntu, SSH, systemd y servicios básicos en reposo | 250–500 MiB |
| Nginx sirviendo estáticos y haciendo proxy | 20–100 MiB |
| Daemon PM2 | 30–80 MiB |
| Node.js/Express en reposo | 80–200 MiB |
| API en uso ligero/moderado (10–20 usuarios activos) | 300–800 MiB para el proceso Node, con picos superiores posibles |
| Frontend compilado con Vite durante `npm run build` | aprox. 1–2 GiB; puede superar 2 GiB según dependencias y optimizaciones |

La concurrencia no multiplica directamente la RAM por usuario: las solicitudes que esperan Supabase suelen consumir poco CPU, pero consultas que cargan grandes resultados, generación de reportes y serialización de JSON pueden elevar memoria y CPU. Pagina resultados grandes y evita procesar colecciones completas en memoria cuando sea posible. Mantén inicialmente una sola instancia de Node bajo PM2; el modo cluster o varios workers aumenta la memoria utilizada.

### Compilar dentro o fuera del servidor

- **En CI/desarrollo:** es lo recomendado. Compila con Node compatible con Vite 8, publica `dist/` y no instales dependencias de desarrollo en EC2. La RAM de compilación no condiciona la RAM de producción.
- **En EC2:** en una máquina de 1 GiB, Vite puede agotar la memoria disponible y el kernel puede terminar el proceso por OOM. Una instancia de 2 GiB puede compilar proyectos pequeños, pero queda poco margen para SO y servicios; 4 GiB ofrece más margen.
- **Swap:** en una micro de 1 GiB es recomendable si se insiste en compilar allí, por ejemplo 2–4 GiB como protección ante picos. No es RAM adicional: puede hacer la compilación muy lenta y no garantiza que termine si la carga supera la memoria disponible. Para producción, es preferible compilar fuera del servidor; swap no reemplaza una instancia adecuada.

## 3. Selección de instancia EC2

| Tipo | vCPU / RAM | Evaluación |
|---|---:|---|
| `t2.micro` | 1 / 1 GiB | Puede arrancar Ubuntu, Nginx y una API muy ligera, pero tiene poco margen para producción, actualizaciones o compilación. |
| `t3.micro` | 2 / 1 GiB | CPU burstable y más vCPU que `t2.micro`, pero conserva el límite crítico de 1 GiB RAM. No la elegiría como objetivo de producción con margen. |
| `t3.small` | 2 / 2 GiB | **Mínimo recomendado** si el frontend se compila fuera, se ejecuta un único proceso Node y la carga es ligera/moderada. Vigilar memoria, créditos de CPU y OOM. |
| `t3.medium` | 2 / 4 GiB | Opción preferida si hay reportes pesados, compilación ocasional, picos o se desea más margen para mantenimiento y crecimiento. |
| `t4g.small` | 2 / 2 GiB | Alternativa Graviton de buen precio/rendimiento, si todos los componentes y artefactos se despliegan para ARM64 y la región la ofrece. |

Las familias T son **burstable**: el rendimiento sostenido de CPU está sujeto a créditos y al modo configurado. No dimensionaría la capacidad suponiendo que el rendimiento “hasta” anunciado se mantiene indefinidamente. T3.micro tiene 2 vCPU y 1 GiB; T2.micro tiene 1 vCPU y 1 GiB. Comprueba especificaciones y disponibilidad vigentes en la [página de instancias T3](https://aws.amazon.com/ec2/instance-types/t3/) y en EC2 para tu región.

### ¿Puede usarse la capa gratuita?

Puede servir para una prueba o un servicio de muy bajo tráfico si el tipo de instancia es elegible para la cuenta y región. **No asumiría que una `t2.micro` o `t3.micro` será gratuita ni que tiene capacidad suficiente para producción.** Las condiciones dependen de la antigüedad y modalidad de la cuenta, región, créditos disponibles y recursos asociados; EBS, IPv4 pública, transferencia de datos y otros servicios también pueden generar cargos.

La oferta de AWS para cuentas nuevas se basa actualmente en créditos y en un plan gratuito con condiciones y duración concretas, no en una garantía universal de 750 horas gratuitas para cualquier cuenta. Verifica las condiciones de tu cuenta y los costos estimados en [AWS Free Tier](https://aws.amazon.com/free/) y AWS Pricing Calculator antes de desplegar.

### Red y ancho de banda

No hay datos de solicitudes por segundo, tamaño promedio de respuestas ni volumen diario para calcular un ancho de banda exacto. Para este diseño, las imágenes salen de Cloudinary y los estáticos del frontend son pequeños; Supabase concentra el tráfico de base de datos. Para una operación de 10–20 usuarios con uso administrativo normal, la red de una instancia `t3.small` debería ser suficiente como punto de partida, pero no es una garantía frente a cargas altas o respuestas grandes.

Estima el caudal de la API con:

```text
Mbps aproximados = solicitudes por segundo × bytes promedio de respuesta × 8 / 1,000,000
```

Mide solicitudes, bytes transferidos, latencia y errores en producción; revisa también límites/cargos de transferencia de salida. El rendimiento de red anunciado para instancias T es “hasta” y depende del tamaño, carga y condiciones de la plataforma, por lo que no equivale a ancho de banda sostenido garantizado.

## 4. Comandos para medir carpetas

Ejecuta los comandos desde la raíz del proyecto. En este monorepo la carpeta de código React es `src/`, el `package.json` del frontend está en la raíz y no existe `frontend/`. `node_modules/` y `dist/` también están en la raíz.

### PowerShell (Windows)

Este comando mide cada directorio existente en bytes, MiB y GiB:

```powershell
$paths = @('backend', 'frontend', 'src', 'node_modules', 'dist') |
  Where-Object { Test-Path -LiteralPath $_ -PathType Container }

foreach ($path in $paths) {
  $bytes = (Get-ChildItem -LiteralPath $path -File -Recurse -Force -ErrorAction SilentlyContinue |
    Measure-Object -Property Length -Sum).Sum
  if ($null -eq $bytes) { $bytes = 0 }
  [PSCustomObject]@{
    Carpeta = $path
    Bytes = [long]$bytes
    MiB = [math]::Round($bytes / 1MB, 2)
    GiB = [math]::Round($bytes / 1GB, 3)
  }
}
```

Si el proyecto está organizado con `frontend/`, esa ruta aparecerá automáticamente. En este checkout, usa `src/` para medir el código fuente del frontend; para ver el peso total del checkout no sumes las carpetas sin considerar que `dist/` y `node_modules/` son artefactos y dependencias separados.

### Bash (Linux/macOS/WSL)

```bash
du -sh backend src node_modules dist
```

Si existe una carpeta `frontend/` en tu copia, mídela en lugar de `src/` o junto a ella según lo que quieras comparar:

```bash
du -sh backend frontend node_modules dist
```

`du` mide el espacio ocupado en disco y puede diferir ligeramente del total de bytes de los archivos por el tamaño de bloque y el sistema de archivos. Para comparar con el tamaño asignado a EBS, revisa además el espacio real de la instancia con `df -h`.

## Referencias de operación

- Mantén logs de PM2 y del sistema con rotación y límite de retención; alerta antes de llegar al 70–80 % del volumen.
- Usa `npm ci --omit=dev` para instalar dependencias de producción del backend cuando haya un lockfile correspondiente. No copies el `node_modules/` de Windows a Ubuntu: las dependencias nativas, si las hay, deben instalarse para la plataforma de destino.
- Genera el `dist/` en CI con una versión de Node compatible y despliega ese artefacto junto con el backend.
- Supervisa CPU, memoria, espacio de disco, créditos de CPU, latencia de API y errores OOM. Ajusta el tamaño de instancia con datos observados, no únicamente con el número de rutas.
