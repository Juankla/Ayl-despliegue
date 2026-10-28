# Plan de respaldo y recuperación de datos

## Sistema de Gestión de Inventario y Ventas — A&L Compresores y Partes

**Fecha de emisión:** 28 de octubre de 2026

**Estado:** Sistema Implementado y Operativo en Producción (Plan Free / Integración Serverless + Cloud Storage)

**Proyecto Base de Datos:** Supabase (PostgreSQL + Auth)

**Infraestructura de Despliegue:** Vercel (Arquitectura Serverless Express / React)

**Almacenamiento Multimedia:** Cloudinary (Imágenes y catálogos de repuestos)

**Destino de Respaldos Externos:** Google Drive Corporativo vía Webhook dedicado (Google Apps Script)

**Titulares del Proyecto / Clientes:** Alfred Vesga y Liliana Vesga (A&L Compresores y Partes)

**Responsables Técnicos / Ejecución:** Juan Camilo Cadena Barragán, Julian Felipe Muños Vesga, Dilan Jesus Wilches Hernandez, Cristofer Smith Osuna Barragan (Desarrolladores)

> **NOTA TÉCNICA DE IMPLEMENTACIÓN:**
> Debido a que el entorno de base de datos opera bajo el plan Free de Supabase (sin Point-in-Time Recovery gestionado nativamente), se desarrolló e implementó con éxito un subsistema autónomo de respaldos dentro del backend del proyecto. Este componente extrae el estado de las tablas relacionales y lo transmite cifrado y empaquetado directamente hacia el almacenamiento de Google Drive corporativo de A&L Compresores y Partes, permitiendo la activación a demanda desde el panel administrativo.

---

### 1. Alcance de los Activos Digitales y Tablas Respaldadas

1. **Base de Datos Relacional (Supabase PostgreSQL):** Extracción integral de 13 tablas maestras y transaccionales del esquema público:
* `bodega`, `producto_bodega`
* `productos`
* `stock_movimiento`
* `orden`, `orden_item`
* `usuario`
* `carrito`, `carrito_item`, `favoritos`, `reserva`
* `resenas_producto`
* `notificaciones_stock`


2. **Autenticación (Supabase Auth / JWT):** Tokens y credenciales de acceso bajo variables cifradas (`JWT_SECRET`, llaves de API).
3. **Multimedia y Archivos Físicos (Cloudinary):** Fichas técnicas y fotografías de maquinaria y componentes; mantienen redundancia en la red de entrega de Cloudinary.
4. **Mecanismo de Almacenamiento Seguro (Google Drive):** Receptor mediante Google Apps Script configurado para admitir peticiones autenticadas vía Webhook (`/exec`), depositando volcados estructurados (`.json`) en la carpeta protegida de A&L.
5. **Código Fuente:** Versionado en repositorio de GitHub, distribuido en arquitectura modular (backend serverless y frontend SPA en Vite).

---

### 2. Arquitectura del Sistema de Respaldo

```text
[ Panel Admin (DashboardHome.jsx) ]
                │
                ▼ (POST /api/backup/generar-respaldo-drive)
[ API Backend Serverless (Vercel Node.js) ]
                │
        ┌───────┴────────────────────────┐
        ▼                                ▼
[ Supabase Client SDK ]        [ Google Drive Webhook ]
(Extracción 13 Tablas)         (Google Apps Script .exec)
        │                                │
        └───────────────┬────────────────┘
                        ▼
    [ Archivo JSON fechado en Google Drive ]

```

---

### 3. Controles Acordados e Implementados

| Control | Especificación Técnica | Estado |
| --- | --- | --- |
| **Mecanismo de Backup** | Módulo de extracción en Node.js (`backend/routes/backup.js`) consultando las 13 tablas relacionales y despachando payload JSON mediante `fetch` con redirección controlada (`follow`). | **Implementado y Operativo** |
| **Disparador del Respaldo** | Botón interactivo "Respaldar en Drive" en la barra de herramientas del Panel de Control (`DashboardHome.jsx`) con estados de confirmación y advertencia. | **Implementado y Operativo** |
| **Destino de Copia Remota** | Carpeta corporativa en Google Drive gestionada por Google Apps Script (`GOOGLE_DRIVE_WEBHOOK_URL`). | **Configurado y Verificado** |
| **Copia Física de Respaldo** | Volcado local de contingencia en formato `backup_ayl_AAAA-MM-DD.json`. | **Operativo en ejecuciones CLI** |
| **Variables de Entorno** | Despliegue en Vercel con llaves seguras: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GOOGLE_DRIVE_WEBHOOK_URL`, `JWT_SECRET`. | **Configuradas en Producción** |
| **RPO (Pérdida máxima tolerable)** | Tiempo transcurrido entre el último clic de respaldo administrativo y la eventual falla. Se recomienda respaldar al cierre de caja/jornada semanal. | **Bajo demanda del administrador** |
| **RTO (Tiempo de Restauración)** | 1 a 2 horas para inyectar el archivo JSON de vuelta a Supabase mediante script de seeding/restauración. | **Validado** |

---

### 4. Procedimiento Operativo Estándar (SOP)

#### A. Generación Manual desde el Panel Web (Operación Diaria / Administrativa)

1. El usuario administrador autenticado accede al **Panel de Control** del sistema.
2. En la barra superior, hace clic en el botón **"Respaldar en Drive"**.
3. Confirma la acción en el cuadro de diálogo del navegador.
4. El sistema mostrará el estado *"Respaldando..."* y confirmará con una alerta en pantalla:
`¡Respaldo guardado exitosamente en Drive! (backup_ayl_AAAA-MM-DD.json)`.
5. El archivo queda depositado de forma automática en la carpeta corporativa de Google Drive.

#### B. Generación de Contingencia por Consola (Mantenimiento Técnico)

1. En caso de corte de acceso a Vercel o problemas de red en el frontend, el responsable técnico accede al entorno local del backend.
2. Ejecuta el comando:
```bash
npm run backup
# o directamente: node routes/backup.js

```


3. El script genera la copia local en el directorio del servidor y envía el paquete al Webhook de Google Drive.

#### C. Protocolo de Restauración ante Falla Crítica

1. **Aprobación:** Toda restauración total o parcial sobre la base de producción requiere autorización de Alfred Vesga o Liliana Vesga.
2. **Descarga del último punto de control:** Descargar el archivo `backup_ayl_*.json` más reciente desde la carpeta de Google Drive.
3. **Inyección de datos:**
* Si Supabase se encuentra operativo: ejecutar el script de inserción masiva (`upsert`) a través de la API.
* Si se provisiona un nuevo proyecto de Supabase: actualizar las variables `SUPABASE_URL` y `SUPABASE_ANON_KEY` en el panel de Vercel y correr la migración de esquema junto con el JSON de respaldo.


4. **Verificación:** Certificar la consistencia comprobando la integridad en las tablas críticas: `productos`, `stock_movimiento` y `usuario`.

---

### 5. Análisis de Confiabilidad y Escalabilidad Futura

El mecanismo actual garantiza consistencia operativa total para el volumen presente y proyectado a mediano plazo. No obstante, se establecen los umbrales de infraestructura y los planes de mitigación correspondientes ante el crecimiento de datos:

| Factor Crítico | Límite Técnico de la Plataforma | Impacto Operativo | Plan de Mitigación / Protocolo de Escalabilidad |
| --- | --- | --- | --- |
| **Límite de filas por petición (Supabase)** | PostgREST limita por defecto a **1.000 registros** por consulta `select('*')`. | Inocuo para el volumen actual. Cuando una tabla (`stock_movimiento`, etc.) supere las 1.000 filas, la extracción plana omitiría registros excedentes. | **Paginación por Lotes:** Cuando se alcancen ~800 registros por tabla, actualizar el script extractor para iterar con `.range(desde, hasta)` en bloques de 1.000 hasta agotar la tabla. |
| **Tiempo de vida Serverless (Vercel)** | Límite de ejecución de **10 a 15 segundos** por invocación en el plan gratuito de Vercel. | Actualmente toma de 2 a 4 segundos. Con decenas de miles de filas, la consulta HTTP acumulada podría disparar un error `504 Gateway Timeout`. | **Canal de Contingencia CLI:** Ante respaldos muy pesados, ejecutar la extracción mediante `npm run backup` desde la terminal local, la cual carece de restricciones de timeout serverless. |
| **Carga útil máxima (Payload Webhook)** | Google Apps Script admite cuerpos de petición `POST` de hasta **~50 MB**. | Inocuo a largo plazo. Un payload JSON de 50 MB en texto plano soporta entre **200.000 y 300.000 registros** transaccionales completos. | **Partición de Archivos:** Dividir el volcado en múltiples archivos por grupo de tablas solo si el JSON total excede los 40 MB. |

---

### 6. Objetivos y Compromisos RPO / RTO

* **Objetivo de Punto de Recuperación (RPO):** Los datos quedan salvaguardados al instante cada vez que los titulares o administradores pulsan el botón de respaldo. Se recomienda realizar la operación al finalizar cada jornada operativa o tras ingresar lotes importantes de mercancía.
* **Objetivo de Tiempo de Recuperación (RTO):** Ante eliminación accidental o corrupción de registros, la restauración de datos a partir del JSON estructurado toma menos de **2 horas hábiles**.

---

### 7. Registro de Evidencia y Pruebas Técnicas

| Fecha | Tipo / Alcance | Entorno | Resultado | Responsable Técnico | Evidencia |
| --- | --- | --- | --- | --- | --- |
| **2026-10-28** | Extracción total de 13 tablas relacionales | Supabase CLI / Node.js local | **Exitoso:** 29 productos, 83 movimientos de stock, 8 usuarios, 3 notificaciones, 2 reseñas respaldadas localmente. | Juan Camilo Cadena | Archivo local `backup_ayl_2026-10-28.json` |
| **2026-10-28** | Transmisión remota cifrada vía Webhook | Google Apps Script / Drive API | **Exitoso:** Conexión HTTP POST con redirección automática validada en carpeta de Drive. | Juan Camilo Cadena | Respuesta Webhook JSON `{ status: "success" }` |
| **2026-10-28** | Integración UI en Panel de Control | Vercel Serverless / React SPA | **Exitoso:** Botón desplegado en barra superior de `DashboardHome.jsx` consumiendo `/api/backup/generar-respaldo-drive`. | Juan Camilo Cadena | Validación interactiva en frontend |