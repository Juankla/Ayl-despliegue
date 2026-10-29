# Resumen ejecutivo

## Sistema de gestión para A&L Compresores y Partes

> **Propuesta de solución** para centralizar inventario, ventas y operaciones en una plataforma web y móvil.

| Cliente | Ubicación | Duración estimada |
|---|---|---:|
| A&L Compresores y Partes | Los Mártires, Bogotá D. C., Colombia | 8 semanas |

---

## En síntesis

A&L Compresores y Partes comercializa filtros, aceites, separadores y repuestos para compresores y maquinaria pesada. La operación requiere consultar existencias con rapidez, ubicar físicamente los productos y mantener trazabilidad de los movimientos.

La solución propuesta centraliza la gestión de inventario y bodegas, compras, ventas, clientes y reportes. Su objetivo es reducir errores operativos y facilitar decisiones oportunas mediante información disponible en una plataforma web y móvil.

### Indicadores de la propuesta

| Indicador | Proyección |
|---|---:|
| Ahorro o recuperación mensual estimada | **$1.200.000 COP** |
| Retorno de inversión estimado | **180 % a 6 meses** |
| Punto de equilibrio proyectado | **Entre los meses 2 y 3** |
| Plazo de implementación | **8 semanas** |
| Mantenimiento mensual propuesto | **$150.000 COP** |

> Las cifras de ahorro, ROI y punto de equilibrio son estimaciones de la propuesta y deben validarse con el cliente antes de usarse como compromisos o resultados garantizados.

## Contenido

1. [Información general](#1-informacion-general)
2. [Objetivos del proyecto](#2-objetivos-del-proyecto)
3. [Justificación](#3-justificacion)
4. [Alcance de la solución](#4-alcance-de-la-solucion)
5. [Beneficios e impacto financiero](#5-beneficios-e-impacto-financiero)
6. [Diferenciadores](#6-diferenciadores)
7. [Cronograma de implementación](#7-cronograma-de-implementacion)
8. [Esquema de inversión](#8-esquema-de-inversion)
9. [Estrategia de crecimiento](#9-estrategia-de-crecimiento)
10. [Riesgos de mantener la operación manual](#10-riesgos-de-mantener-la-operacion-manual)
11. [Próximos pasos](#11-proximos-pasos)
12. [Conclusión y contacto](#12-conclusion-y-contacto)

---

## 1. Información general

### Empresa

**A&L Compresores y Partes** se dedica a la venta de filtros, aceites, separadores y repuestos para compresores y maquinaria pesada. Su operación está orientada a la disponibilidad de inventario, la rapidez de atención y el conocimiento técnico del producto.

**Dirección:** Cl. 6 #46, Los Mártires, Bogotá D. C., Colombia.

### Contacto del cliente

| Representante | Teléfono | Correo electrónico |
|---|---|---|
| Alfred Vesga Vesga | 311 440 5432 | alfredvesga@hotmail.com |

## 2. Objetivos del proyecto

### Objetivo general

Desarrollar e implementar un sistema de información web y móvil para centralizar la gestión de inventarios de repuestos y suministros, integrando un módulo de ventas y control de operaciones. La solución busca reducir pérdidas operativas, organizar la información de bodega y fortalecer la gestión comercial.

### Objetivos específicos

- Centralizar la información del inventario y mejorar el control de existencias.
- Dar trazabilidad a la recepción, ubicación física y despacho de productos.
- Optimizar el ciclo de compras y el abastecimiento con proveedores.
- Automatizar reportes e indicadores para respaldar decisiones gerenciales y reducir errores operativos.

## 3. Justificación

La empresa administra referencias críticas para maquinaria pesada, cuya disponibilidad y ubicación física son importantes para atender las solicitudes de los clientes. El uso de registros manuales y hojas de cálculo descentralizadas puede ocasionar:

- Diferencias entre las existencias físicas y los registros.
- Demoras en la búsqueda y entrega de repuestos de alta rotación.
- Dificultad para auditar quién autoriza o ejecuta entradas y salidas de bodega.
- Errores de planificación que producen desabastecimiento o sobrecostos de almacenamiento.
- Falta de respaldos automatizados y mayor exposición ante fallas o pérdida de información local.

## 4. Alcance de la solución

### 4.1 Inventario y bodegas

- Ficha técnica de productos con códigos, proveedores, marcas, compatibilidades y unidades de medida.
- Registro de ubicación física por estantería y bodega.
- Control de existencias y categorización de repuestos de alta rotación.
- Trazabilidad cronológica de entradas, salidas y traslados.

### 4.2 Compras y abastecimiento

- Catálogo de proveedores y condiciones comerciales.
- Gestión y seguimiento del estado de órdenes de compra.
- Notificaciones de existencias por debajo del umbral mínimo para facilitar el reabastecimiento preventivo.

### 4.3 Ventas y clientes

- Registro de transacciones comerciales y cotizaciones.
- Directorio de clientes con historial de compras.
- Consulta de existencias desde mostrador o durante visitas en campo.

### 4.4 Reportes, analítica y respaldos

- Paneles interactivos con valoración monetaria del inventario en COP.
- Alertas de stock crítico e información histórica de rotación.
- Módulo de respaldo con exportación periódica a Google Drive.

### 4.5 Tecnología y perfiles de acceso

#### Stack tecnológico propuesto

| Componente | Tecnología / propósito |
|---|---|
| Frontend web | React 19, Vite y Bootstrap 5; diseño adaptable a computadores, tabletas y teléfonos. |
| Aplicación móvil | Flutter para Android e iOS. |
| Backend | Node.js y Express, con despliegue serverless en Vercel. |
| Base de datos y autenticación | PostgreSQL gestionado en Supabase, autenticación JWT y políticas RLS. |
| Multimedia | Cloudinary para imágenes y fichas de productos. |
| Respaldos | Google Drive API para volcados estructurados en JSON. |

#### Perfiles de acceso

| Perfil | Responsabilidades principales |
|---|---|
| **Administrador (nivel máster)** | Administración de la plataforma, reportería financiera, auditoría de usuarios y configuración global. |
| **Operario / bodeguero** | Registro de entradas, salidas, traslados entre bodegas y toma física de inventario. |
| **Asesor comercial** | Consulta de existencias, creación de pedidos y elaboración de cotizaciones para clientes. |

## 5. Beneficios e impacto financiero

### 5.1 Proyección mensual

| Área | Mejora estimada | Ahorro / recuperación mensual |
|---|---:|---:|
| Facturación y despachos | 25 % | $300.000 COP |
| Recuperación y cobros | 30 % | $200.000 COP |
| Control y mermas de inventario | 40 % | $400.000 COP |
| Eficiencia operativa del personal | 35 % | $300.000 COP |
| **Total estimado** | — | **$1.200.000 COP** |

### 5.2 Métricas proyectadas

- **Retorno estimado:** 180 % a seis meses, con punto de equilibrio proyectado entre el segundo y el tercer mes.
- **Discrepancias de inventario:** reducción proyectada del 90 % en errores de conteo y despacho.
- **Respaldos:** objetivo de mantener el 100 % de la información comercial y de inventario respaldada en la nube.
- **Seguimiento de cartera:** reducción proyectada del 40 % en retrasos de seguimiento a cuentas de clientes.
- **Disponibilidad:** acceso seguro multidispositivo 24/7.

> Estos porcentajes son objetivos y estimaciones; su cumplimiento depende de la adopción del sistema, la calidad de los datos y la operación de los servicios externos.

## 6. Diferenciadores

- **Acompañamiento local:** desarrollo ajustado a las dimensiones y dinámicas reales de la bodega en Los Mártires, Bogotá.
- **Flexibilidad evolutiva:** posibilidad de incorporar nuevos flujos y adaptaciones del catálogo sin depender de licencias rígidas de software empaquetado.

## 7. Cronograma de implementación

| Fase | Duración | Actividades principales |
|---|---:|---|
| **1. Levantamiento y análisis** | Semanas 1–2 | Reunión de inicio con gerencia, definición de flujos de inventario y perfiles de usuario, consolidación de datos maestros desde Excel. |
| **2. Configuración y migración** | Semanas 3–4 | Estructuración de la base de datos en Supabase, parametrización de bodegas, migración del catálogo y pruebas internas. |
| **3. Capacitación y pruebas** | Semanas 5–6 | Ocho horas de capacitación presencial al equipo de bodega y administración, validación de usabilidad y ajustes finales. |
| **4. Salida a producción** | Semanas 7–8 | Puesta en marcha, acompañamiento durante el inventario físico inicial y firma del acta de entrega a satisfacción. |

## 8. Esquema de inversión

| Concepto | Valor propuesto | Incluye |
|---|---:|---|
| Implementación (pago único) | **Por definir: a convenir / $10.000.000 COP** | Configuración, desarrollo web y móvil, migración de datos, ocho horas de capacitación presencial, manuales y acompañamiento en el despliegue. |
| Operación y mantenimiento mensual | **$150.000 COP / mes** | Soporte técnico remoto, mantenimiento preventivo, monitoreo de disponibilidad y administración de servicios en la nube (Vercel, Supabase y Google Drive). |

## 9. Estrategia de crecimiento

- **Corto plazo:** digitalizar el 100 % de las referencias físicas de la sede central en Bogotá y consolidar el registro diario de transacciones.
- **Mediano plazo:** habilitar pedidos B2B en un canal digital y automatizar solicitudes de reabastecimiento con proveedores locales e internacionales.

## 10. Riesgos de mantener la operación manual

- **Pérdidas económicas:** capital inmovilizado o perdido por piezas no registradas, compras duplicadas o artículos extraviados.
- **Inconsistencias fiscales:** dificultad para conciliar reportes de existencias y ventas frente a las exigencias de la DIAN.
- **Pérdida de clientes:** riesgo de perder compradores por demoras en cotizaciones y despachos de repuestos urgentes.
- **Barrera de escalabilidad:** dificultad para abrir nuevos puntos de venta o almacenes sin un sistema centralizado.

## 11. Próximos pasos

1. **Validar requerimientos:** revisar con Alfred Vesga los flujos de trabajo y el alcance final.
2. **Formalizar el servicio:** acordar y firmar el contrato, y definir el anticipo correspondiente.
3. **Iniciar el proyecto:** comenzar la fase de limpieza de datos y aprovisionamiento de infraestructura.

## 12. Conclusión y contacto

El proyecto propone dotar a A&L Compresores y Partes de una herramienta para reemplazar procesos manuales por una operación más ágil y trazable. La centralización del inventario, las ventas y los movimientos de bodega puede sentar bases para mejorar el control operativo y apoyar el crecimiento comercial.

### Equipo técnico

| Nombre | Correo electrónico | Teléfono |
|---|---|---|
| Julian Felipe Muñoz Vesga | julianvesga135@gmail.com | 322 905 6201 |
| Juan Camilo Cadena Barragán | juan12camilo.cadena@gmail.com | 3204830626 |
| Dilan Jesus Wilches Hernandez | dilanjwilchesh@gmail.com |  324 3452243 |
| Cristores Smit Osuna Barragan | osunabarragancrustoferesmit@gmail.com | 314 2863593 |


---

**Documento confidencial — Para uso exclusivo de A&L Compresores y Partes.**
