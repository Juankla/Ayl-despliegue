# Stack tecnológico

## Resumen

La aplicación A&L es una tienda y sistema de gestión construido con JavaScript. Está organizado en un frontend de una sola página con React y Vite, un backend HTTP con Node.js y Express, y Supabase como servicio principal de autenticación y persistencia.

## Lenguajes y formatos

- **JavaScript (ES modules):** lenguaje del frontend y del backend. Los archivos usan `import`/`export`.
- **JSX:** marcado de interfaz dentro de los componentes React (`.jsx`).
- **HTML:** documento de entrada servido por Vite desde `index.html`.
- **CSS:** estilos globales y propios (`src/index.css`, `src/App.css`, `src/styles.css`), junto con Bootstrap.
- **JSON:** manifiestos de dependencias y configuración (`package.json`) e intercambio de datos de la API.

El código revisado no está escrito en TypeScript.

## Frontend

- **React 19:** composición de la interfaz en componentes y vistas. `src/App.jsx` coordina vistas, estado de sesión, carrito y paneles.
- **Vite 8:** servidor local de desarrollo con recarga rápida y herramienta de compilación para producción. Los comandos están definidos en el `package.json` raíz.
- **Bootstrap 5** y **Bootstrap Icons:** estilos y elementos visuales, complementados por CSS propio.
- **React Icons:** biblioteca adicional de iconos.
- **React Router DOM:** dependencia disponible para navegación; algunas decisiones de vista también se gestionan desde la aplicación.
- **React Helmet Async:** administración de metadatos de las vistas.
- **SweetAlert2:** diálogos y alertas.
- **EmailJS** y **Google OAuth:** dependencias para integraciones de correo y autenticación con Google.

Las páginas y componentes están organizados bajo `src/Pages` y `src/components`; las integraciones comunes están en `src/lib`.

## Backend

- **Node.js:** entorno de ejecución del servidor.
- **Express 4** en el manifiesto de `backend`: framework HTTP para la API REST.
- **CORS** y middleware JSON/form-urlencoded: recepción de solicitudes del frontend.
- **dotenv:** carga de configuración desde variables de entorno.
- **jsonwebtoken:** emisión o validación de JWT en los flujos del backend.
- **Nodemon:** reinicio del servidor durante el desarrollo.

El punto de entrada es `backend/server.js`. Monta las rutas bajo `/api` y separa la implementación por dominio en `backend/routes` y `backend/controllers`: autenticación, usuarios, productos, bodegas, órdenes, reseñas, carrito, reportes, bitácora y notificaciones.

El frontend consume el backend mediante `src/lib/api.js` y la configuración centralizada de `src/config/api.js`. `VITE_API_URL` define el origen del backend (sin el sufijo `/api`); si no está definida, las peticiones usan rutas relativas `/api`, compatibles con los rewrites de Vercel. Para desarrollo local, configura `VITE_API_URL=http://localhost:3001` en un archivo `.env.local` que no se publique.

## Base de datos y autenticación

- **Supabase** es la integración principal visible en el código. El cliente del frontend se crea en `src/lib/client.js` con `@supabase/supabase-js` y utiliza autenticación de Supabase y consultas a tablas, por ejemplo `usuario`.
- El backend también crea un cliente Supabase en `backend/config/supabase.js`. Las rutas y controladores trabajan con esta integración.
- El flujo combina la sesión de Supabase con un JWT personalizado del backend para algunas solicitudes protegidas. El frontend guarda ese token en `localStorage` como `auth_token`.
- Variables usadas por el frontend: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. El backend espera `SUPABASE_URL` y `SUPABASE_ANON_KEY` en su configuración.

La clave `anon` del frontend es una clave pública de cliente, no un secreto. El acceso a datos debe limitarse con las políticas de seguridad de Supabase (RLS) y las credenciales privilegiadas deben permanecer exclusivamente en el servidor.

## Otras dependencias e integraciones

- En el manifiesto raíz aparecen clientes o controladores para **MySQL (`mysql2`)**, **PostgreSQL (`pg`)**, **Firebase** y **json-server**. Sin embargo, la configuración y el flujo examinados apuntan a Supabase; su presencia en `package.json` por sí sola no demuestra que esos servicios estén conectados o activos.
- El README de documentación menciona **Cloudinary** para imágenes optimizadas. Esta integración debe considerarse documentada por el proyecto, pero no confirmada aquí como dependencia del código revisado.
- **ESLint 9** se usa para analizar el código; la configuración está en `eslint.config.js`.

## Desarrollo y compilación

Desde la raíz del proyecto:

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

Para el backend, desde `backend`:

```bash
npm run dev
npm start
```

El frontend usa Vite (puerto predeterminado `5173`) y el backend escucha en `3001` salvo que se defina `PORT`. Configura las variables de entorno localmente antes de ejecutar los servicios y no publiques archivos `.env` con credenciales.

## Flujo general

1. El navegador carga la aplicación React servida por Vite o por el artefacto de producción.
2. React presenta el catálogo, el detalle, el carrito, el checkout y las interfaces administrativas según el estado de la aplicación y el usuario.
3. El cliente de Supabase gestiona la autenticación y algunas consultas directas.
4. Para las operaciones cubiertas por la API, `api.js` envía solicitudes al backend Express.
5. El backend aplica las rutas y controladores del dominio y utiliza Supabase como integración de datos.
