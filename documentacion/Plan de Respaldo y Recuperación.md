# Plan de respaldo y recuperación de datos
## Sistema de Gestión de Inventario y Ventas — A&L Compresores y Partes

**Fecha de emisión:** 27 de octubre de 2026  
**Estado:** Propuesta técnica de contingencia (Plan Free / Respaldos Externos)  
**Proyecto Base de Datos:** Supabase (PostgreSQL + Auth)  
**Almacenamiento Multimedia:** Cloudinary (Imágenes y catálogos de repuestos)  

**Titulares del Proyecto / Clientes:** Alfred Vesga y Liliana Vesga (A&L Compresores y Partes)  
**Responsable Técnico / Ejecutor:** Juan Camilo Cadena Barragán, Julian Felipe Muños Vesga, Dilan Jesus Wilches Hernandez, Cristofer Smith Osuna Barragan (Desarrolladores)  

> **ADVERTENCIA TÉCNICA:**  
> El entorno actual de base de datos opera bajo el plan Free de Supabase, el cual NO incluye 
> servicios gestionados de Point-in-Time Recovery (PITR) ni backups diarios automáticos por 
> panel. Por tanto, el presente plan establece un protocolo de contingencia mediante extracciones 
> lógicas independientes (pg_dump). La integridad de los datos depende estrictamente de la 
> periodicidad con la que el responsable técnico ejecute y verifique dichas copias.

---

### 1. Alcance de los Activos Digitales

1. **Base de Datos Relacional (PostgreSQL en Supabase):** Contiene tablas de usuarios, roles, catálogo de productos, inventario en bodegas, clientes, proveedores, movimientos de stock, órdenes y compras.
2. **Autenticación (Supabase Auth):** Esquema interno de credenciales y tokens de acceso.
3. **Multimedia y Archivos Físicos (Cloudinary):** Las fotos de compresores y piezas operan fuera de la base de datos; cuentan con redundancia propia gestionada por Cloudinary y no forman parte del volcado `.sql/.dump`.
4. **Código Fuente:** Gestionado y versionado en el repositorio central de GitHub (ramas de frontend y backend).

---

### 2. Controles Acordados

| Control | Especificación Técnica | Estado |
|---|---|---|
| **Mecanismo de Backup** | Extracción lógica mediante `pg_dump` con esquema público y auth. | Propuesto / Por ejecutar |
| **Frecuencia de extracción** | Semanal (cada viernes) y previa a cualquier despliegue mayor en producción. | Por acordar con titulares |
| **Destino de copia independiente** | Google Drive administrativo de A&L + Copia local cifrada del desarrollador. | Pendiente de asignación |
| **RPO preliminar (Pérdida tolerable)** | Máximo 7 días de movimientos (sujeto a la frecuencia del volcado manual). | En evaluación |
| **RTO preliminar (Tiempo de levante)** | 4 a 8 horas hábiles para provisionar base de datos y restaurar esquema. | En evaluación |
| **Control de Acceso y Claves** | Cadena de conexión y `service_role_key` restringidas solo a Juan Camilo Cadena. | Vigente |
| **Validación de Restauración** | Despliegue de prueba en motor PostgreSQL local antes de certificar la copia. | Pendiente de primera prueba |

---

### 3. Procedimiento Operativo Estándar (SOP)

1. **Aprobación:** Toda restauración total o parcial sobre la base de producción requiere autorización escrita de Alfred Vesga o Liliana Vesga.
2. **Generación del respaldo:**
   - El ejecutor técnico ejecuta la herramienta de exportación sobre el proyecto activo.
   - Se genera el archivo bajo el estándar de nombres: `ayl_prod_backup_AAAA-MM-DD.dump`.
3. **Almacenamiento seguro:**
   - El archivo se traslada a la carpeta designada de A&L.
   - Está prohibido subir archivos `.dump` o `.env` al repositorio público o privado de GitHub.
4. **Prueba de Recuperabilidad:**
   - Una vez al mes, el archivo más reciente debe importarse en una base de datos local aislada.
   - Se comprueba la lectura de al menos 3 tablas críticas: `usuarios`, `productos` y `movimientos-stock`.
5. **Cierre de Evento:**
   - Se asienta el resultado en la bitácora de evidencia técnica.

---

### 4. Objetivos y Compromisos RPO / RTO

* **Objetivo de Punto de Recuperación (RPO):** En la configuración actual sin costo adicional, el punto de recuperación más cercano corresponde al último backup manual extraído. Si se requiere un RPO menor a 24 horas continuo, se recomienda la transición formal al plan **Supabase Pro**.
* **Objetivo de Tiempo de Recuperación (RTO):** Ante desastre total o eliminación accidental, el tiempo estimado para aprovisionar un nuevo proyecto en Supabase, reconfigurar variables en Vercel y volcar los datos es de **6 horas hábiles**.

---

### 5. Registro de Evidencia y Pruebas

| Fecha | Tipo / Alcance | Ambiente de Prueba | Resultado | Responsable Técnico | Firma / Evidencia |
|---|---|---|---|---|---|
| *Pendiente* | *Volcado inicial total* | *PostgreSQL Local* | *Por validar* | *Juan Camilo Cadena* | *Por registrar* |