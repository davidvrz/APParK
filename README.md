# APParK - Sistema de Gestión de Parking Inteligente

APParK es una aplicación web full-stack desarrollada como un Trabajo de Fin de Grado (TFG) del Grado en Ingeniería Informática. Su objetivo es ofrecer una solución moderna, eficiente y en tiempo real para la gestión de parkings y de reservas de plazas de aparcamiento, proporcionando interfaces dedicadas tanto para usuarios como para administradores.

## 🌟 Características Principales

### Para Usuarios:
-   **Autenticación Segura y Sesiones Persistentes**: Registro e inicio de sesión mediante JWT, con renovación automática de token para una experiencia de sesión de usuario fluida.
-   **Dashboard Personalizado**:
    -   **Reservas Activas**: Visualización interactiva de reservas en curso, con detalles completos (incluyendo mini-mapa) con opción de gestionar cada reserva (cancelar, modificar si aplica).
    -   **Quick Actions**: Accesos directos a funcionalidades clave como "Nueva Reserva" o "Ver Mapa".
    -   **Historial de Reservas**: Acceso a un registro completo de reservas pasadas.
-   **Mapa Interactivo de Parkings (Leaflet)**:
    -   Visualización geolocalizada de todos los parkings.
    -   Selección de parkings para ver detalles, incluyendo:
        -   **Plano del Parking en Tiempo Real**: Estructura interna con plantas y plazas, mostrando su estado (Libre, Ocupado, Reservado) actualizado usando WebSockets.
        -   **Formulario de Reserva Interactivo**: Selección de plaza (si no preseleccionada), vehículo, y fechas/horas de inicio y fin, con validaciones.
        -   **Anuncios del Parking**: Información relevante publicada por el administrador.
-   **Gestión de Vehículos**: CRUD completo para los vehículos del usuario.
-   **Gestión de Perfil**: Visualización y modificación de datos personales y cambio de contraseña.
-   **Interfaz Moderna y Amigable**: Experiencia de usuario intuitiva y responsiva, con modo oscuro y claro,construida con React, Tailwind CSS y Shadcn/ui.

### Para Administradores:
-   **Dashboard de Administración**:
    -   Estadísticas clave sobre la operativa del parking (ocupación, usuarios, etc.).
    -   Accesos directos a las principales secciones de gestión.
-   **Gestión Completa de Parkings**:
    -   CRUD de parkings (nombre, ubicación, gestión de anuncios, etc.).
    -   Gestión detallada de la estructura interna: CRUD de plantas dentro de cada parking y CRUD de plazas dentro de cada planta (tipo, número, estado base, reservable).
-   **Log de Eventos de Sensores**: Visualización en tiempo real de log de eventos de las plazas (ej. entrada/salida detectada), con opciones de filtrado por parking, planta, plaza y fechas.
-   **Administración de Usuarios**: Listado, visualización de detalles y eliminación de usuarios.
-   **Alternar Vista Admin/Usuario**: Capacidad para que el administrador navegue y utilice la aplicación con la interfaz y funcionalidades de un usuario normal.
-   **Interfaz de Administración Moderna y Amigable**: Consistente con la experiencia de usuario general.

### Para Dispositivos del Parking (Conductores de Acceso Directo):
-   **Acceso sin Registro Previo**: Permite a los conductores utilizar el parking sin necesidad de una cuenta de usuario, interactuando a través de dispositivos/quioscos en el parking.
-   **Ocupación de Plazas**: El conductor puede seleccionar una plaza disponible (no reservable previamente por usuarios online) a través de un dispositivo. Se crea una `ReservaRapida` para ocupar la plaza inmediatamente (Flujo de aparcamiento tradicional).
-   **Autenticación de Dispositivos**: Los dispositivos del parking se autentican mediante un token específico del parking para interactuar con el sistema.
-   **Finalización Automática por Sensores**: La `ReservaRapida` se completa y se calcula el coste cuando los sensores de la plaza detectan la salida del vehículo, registrando un evento de salida.
-   **Actualización en Tiempo Real**: El estado de las plazas se refleja en el plano del parking en tiempo real en los dispositivos del parking y en la app principal.

## 🛠️ Tech Stack

**Frontend:**
-   **React (v18+)** con **Vite**.
-   **JavaScript (ES6+)**.
-   **React Router DOM** para enrutamiento.
-   **Tailwind CSS** para estilizado.
-   **Shadcn/ui** para componentes UI.
-   **Leaflet** para mapas interactivos.
-   **Framer Motion** para animaciones.
-   **Socket.IO Client** para comunicación en tiempo real.
-   **Axios** para peticiones HTTP.
-   **React Context API** (ej. `AuthContext`) para gestión de estado global (autenticación, tema).

**Backend:**
-   **Node.js** con **Express.js**.
-   **Sequelize ORM** para la interacción con la base de datos.
-   **MariaDB (compatible con MySQL)** como sistema de gestión de base de datos.
-   **Socket.IO** para comunicación bidireccional en tiempo real.
-   **JSON Web Tokens (JWT)** para autenticación.
-   **Zod** para validación de esquemas y datos de entrada.
-   **BullMQ** y **Redis** para gestión de colas de tareas (ej. monitorización de reservas, notificaciones).
-   **Bcrypt.js** para hashing de contraseñas.
-   **Dotenv** para la carga de variables de entorno desde archivos `.env`.

**Base de Datos:**
-   **MariaDB**

**Herramientas de Desarrollo y Despliegue:**
-   **Git y GitHub** para control de versiones.
-   **npm** para gestión de dependencias.
-   **Docker y Docker Compose** para contenerización.
-   **Nodemon** para reinicio automático del servidor en desarrollo.
-   **ESLint** para linting.

## 💾 Data Models (Sequelize)

El backend utiliza Sequelize ORM para mapear los siguientes modelos a tablas en la base de datos MySQL. Cada modelo representa una entidad clave en el sistema:

-   **`Usuario`**: Almacena la información de los usuarios registrados.
    -   Campos: `email`, `password_hash`, `nombre_completo`, `telefono`, `rol` (ej. 'admin', 'conductor').

-   **`Vehiculo`**: Registra los vehículos pertenecientes a los usuarios.
    -   Campos: `usuario_id` (referencia al dueño), `matricula`, `modelo`, `tipo` (ej. 'Coche', 'Moto').

-   **`Parking`**: Contiene los detalles de cada aparcamiento gestionado.
    -   Campos: `nombre`, `ubicacion`, `latitud`, `longitud`, `capacidad` (total de plazas), `estado` (ej. 'Operativo', 'Cerrado').

-   **`Planta`**: Define las diferentes plantas o niveles dentro de un parking.
    -   Campos: `parking_id` (referencia al parking), `numero` (identificador de la planta).

-   **`Plaza`**: Representa las plazas de aparcamiento individuales en cada planta.
    -   Campos: `planta_id` (referencia a la planta), `numero` (identificador de la plaza), `reservable` (si se puede reservar), `tipo` (ej. 'Coche', 'Especial'), `estado` (ej. 'Libre', 'Ocupado'), `precio_por_hora`.

-   **`Reserva`**: Guarda la información de las reservas de plazas realizadas por los usuarios.
    -   Campos: `user_id` (quien reserva), `vehiculo_id` (vehículo usado), `plaza_id` (plaza reservada), `start_time`, `end_time`, `estado` (ej. 'activa', 'completada'), `precio_total`.

-   **`Anuncio`**: Permite crear anuncios o notificaciones para parkings específicos.
    -   Campos: `parking_id` (parking asociado), `contenido` (texto del anuncio).

-   **`Eventos`**: Registra los eventos detectados en las plazas (ej. entrada/salida de vehículos).
    -   Campos: `plaza_id` (plaza asociada), `matricula` (si se detecta), `tipo_evento` (ej. 'entrada', 'salida'), `mensaje`, `fecha` del evento.

-   **`ReservaRapida`**: Gestiona las ocupaciones inmediatas de plazas por conductores que acceden directamente al parking y utilizan un dispositivo in-situ. Se completan automáticamente cuando los sensores detectan la salida del vehículo.
    -   Campos: `plaza_id` (plaza ocupada), `matricula` (del vehículo), `start_time` (inicio de ocupación), `end_time` (fin de ocupación, rellenado al salir), `estado` (ej. 'activa', 'completada'), `precio_total`.

Estos modelos están interrelacionados para reflejar la lógica del negocio (ej. un `Usuario` puede tener varios `Vehiculo` y realizar múltiples `Reserva`; un `Parking` se compone de `Plantas`, y estas a su vez de `Plazas`).

## 📁 Estructura del Proyecto
El proyecto APParK se organiza en dos componentes principales: `client` (frontend React) y `server` (backend Node.js/Express), junto con archivos de configuración y Docker en la raíz. A continuación, se detalla la estructura de directorios y archivos más relevantes:

```
APParK/
├── client/                   # Aplicación Frontend (React)
│   ├── public/               # Archivos estáticos (iconos, manifest.json)
│   ├── src/
│   │   ├── api/              # Módulos para interactuar con la API del backend (auth.js, parking.js, etc.)
│   │   ├── assets/           # Imágenes, SVGs
│   │   ├── components/       # Componentes reutilizables de la interfaz de usuario
│   │   │   ├── admin/        # Componentes específicos para la interfaz de administración
│   │   │   ├── dashboard/    # Componentes para el dashboard de usuario
│   │   │   ├── layout/       # Componentes de estructura (HeaderBars)
│   │   │   ├── map/          # Componentes relacionados con el mapa interactivo
│   │   │   ├── ui/           # Componentes genéricos de UI (botones, inputs, etc. - Shadcn/ui)
│   │   │   └── vehicle/      # Componentes para la gestión de vehículos
│   │   ├── hooks/            # Hooks personalizados para lógica reutilizable (useAuth, useParking, etc.)
│   │   ├── layouts/          # Diseños de página principales (MainLayout, AdminLayout)
│   │   ├── lib/              # Funciones de utilidad (utils.js)
│   │   ├── pages/            # Componentes que representan las diferentes vistas/páginas de la aplicación
│   │   │   ├── admin/        # Páginas específicas de la sección de administración
│   │   │   └── reservas/     # Páginas relacionadas con la gestión de reservas
│   │   ├── routes/           # Configuración de rutas y componentes de protección de rutas
│   │   ├── sockets/          # Configuración y manejo del cliente Socket.IO
│   │   ├── store/            # Gestión de estado global (AuthContext)
│   │   ├── styles/           # Archivos de estilos globales (index.css)
│   │   ├── App.jsx           # Componente raíz de la aplicación React
│   │   ├── config.js         # Configuración del cliente (ej. URL de la API)
│   │   └── main.jsx          # Punto de entrada de la aplicación React (renderiza App.jsx)
│   ├── components.json       # Configuración de Shadcn/ui
│   ├── index.html            # HTML principal de la aplicación
│   ├── package.json          # Dependencias y scripts del cliente
│   ├── tailwind.config.js    # Configuración de Tailwind CSS
│   └── vite.config.js        # Configuración de Vite
│
├── server/                   # Aplicación Backend (Node.js/Express)
│   ├── src/
│   │   ├── app.js            # Configuración principal de la aplicación Express (middlewares, rutas)
│   │   ├── config.js         # Configuración del servidor (variables de entorno, etc.)
│   │   ├── controllers/      # Lógica de manejo de peticiones para cada ruta
│   │   ├── database/         # Configuración de la base de datos (Sequelize, db_schema.sql, seeders (para crear el admin))
│   │   ├── jobs/             # Lógica para tareas en segundo plano (BullMQ workers y queues)
│   │   ├── libs/             # Librerías auxiliares (ej. manejo de JWT)
│   │   ├── middlewares/      # Middlewares personalizados (autenticación, validación, admin)
│   │   ├── models/           # Definiciones de modelos de Sequelize para la base de datos
│   │   ├── routes/           # Definiciones de las rutas de la API
│   │   ├── schemas/          # Esquemas de validación de datos (Zod)
│   │   └── sockets/          # Lógica del servidor Socket.IO
│   │   └── index.js          # Punto de entrada del servidor Node.js (inicia el servidor HTTP y Socket.IO)
│   └── package.json          # Dependencias y scripts del servidor
│
├── .env.example              # Ejemplo de archivo de variables de entorno
├── docker-compose.yml        # Configuración de Docker Compose para orquestar los servicios
```

## ⚙️ Prerrequisitos
-   **Node.js**: v18.x o superior.
-   **npm**: v8.x o superior.
-   **Docker & Docker Compose** (Para el método de despliegue recomendado).
-   **Git**.

## 🚀 Despliegue y Puesta en Marcha

Este proyecto está diseñado para ser desplegado fácilmente usando Docker, pero también puede ser ejecutado en un entorno de desarrollo local.

### Requisitos Previos

-   **Docker y Docker Compose**: Para el despliegue contenedorizado (método recomendado).
-   **Node.js (v18+) y npm**: Para el desarrollo local.
-   **Git**: Para clonar el repositorio.

### 1. Despliegue con Docker (Recomendado)

Este método levantará todos los servicios (backend, frontend, MariaDB y Redis) en contenedores Docker, creando un entorno aislado y consistente.

**Paso 1: Clonar el Repositorio**

```bash
git clone https://github.com/davidvrz/APParK.git
cd appark
```

**Paso 2: Configurar Variables de Entorno**

Crea un fichero `.env` en la raíz del proyecto, copiando el ejemplo `.env.example`:

```bash
cp .env.example .env
```

Edita el fichero `.env` y ajusta los valores según sea necesario. Las credenciales de la base de datos (`DB_USER`, `DB_PASSWORD`, `DB_NAME`) serán usadas por Docker Compose para inicializar la base de datos MariaDB automáticamente.

**Paso 3: Levantar los Contenedores**

Desde la raíz del proyecto, ejecuta:

```bash
docker-compose up --build
```

Este comando hará lo siguiente:
1.  Construirá las imágenes de Docker para el `server` y el `client`.
2.  Descargará las imágenes de `mariadb` y `redis`.
3.  Creará e iniciará los contenedores.
4.  **Ejecutará el seeder**: El usuario administrador (`admin@appark.com` con contraseña `admin123`) se creará automáticamente en la base de datos.

Una vez que todos los servicios estén en marcha:
-   **Frontend**: Accede a `http://localhost:5173`
-   **Backend API**: Disponible en `http://localhost:3000`

**Paso 4: Acceder a la Base de Datos (Opcional)**

Si necesitas interactuar directamente con la base de datos MariaDB, puedes usar el siguiente comando:

```bash
docker exec -it mariadb_app mariadb -u root -p
```

Se te pedirá la `MYSQL_ROOT_PASSWORD` que definiste en tu fichero `.env`.

### 2. Ejecución en Local (Desarrollo)

Si prefieres no usar Docker para la app, puedes ejecutar el frontend y el backend por separado en la terminal local.

**Requisitos Adicionales:**
-   Tener una instancia de **MariaDB** y **Redis** corriendo en tu máquina local.

**Backend (`/server`):**

1.  Navega al directorio del servidor: `cd server`
2.  Instala dependencias: `npm install`
3.  Configura un fichero `.env` en este directorio con las credenciales de tu base de datos local y Redis.
4.  Ejecuta las migraciones o importa el esquema desde `src/database/db_schema.sql`.
5.  Ejecuta el seeder para crear el admin: `npm run seed`
6.  Inicia el servidor: `npm start`

**Frontend (`/client`):**

1.  Navega al directorio del cliente: `cd client`
2.  Instala dependencias: `npm install`
3.  Configura un fichero `.env` en este directorio, apuntando `VITE_API_URL` y `VITE_SOCKET_URL` a tu backend local (ej. `http://localhost:3000`).
4.  Inicia la aplicación de desarrollo: `npm run dev`

## 📜 Scripts Disponibles

**Servidor (`server/package.json`):**
-   `npm run start`: Inicia el servidor en modo producción.
-   `npm run dev`: Inicia el servidor en modo desarrollo con `nodemon`.
-   `npm run seed`: Ejecuta el script para crear el usuario administrador si no existe.

**Cliente (`client/package.json`):**
-   `npm run dev`: Inicia el servidor de desarrollo de Vite.
-   `npm run build`: Compila la aplicación para producción.
-   `npm run lint`: Ejecuta ESLint para corregir errores de estilo.
-   `npm run preview`: Sirve la build de producción.

## 🌐 API Overview (Endpoints Principales)

La API RESTful del backend está organizada por módulos y sigue los prefijos base `/api`.

-   **Autenticación (`/api/auth`)** (Manejado por `auth.routes.js`):
    -   `POST /register`: Registro de nuevos usuarios.
    -   `POST /login`: Inicio de sesión.
    -   `POST /refresh`: Refrescar token de acceso.
    -   `POST /logout`: Cierre de sesión (requiere autenticación).

-   **Perfil de Usuario (`/api/profile`)** (Manejado por `profile.routes.js`, requiere autenticación para todas las rutas):
    -   `GET /`: Obtener datos del perfil del usuario autenticado.
    -   `PUT /`: Actualizar datos del perfil del usuario.
    -   `DELETE /`: Eliminar la cuenta del usuario.
    -   `GET /vehicles`: Listar vehículos del usuario.
    -   `POST /vehicle`: Añadir un nuevo vehículo.
    -   `PUT /vehicle/:id`: Actualizar un vehículo existente.
    -   `DELETE /vehicle/:id`: Eliminar un vehículo.
    -   `GET /admin/users`: Listar todos los usuarios (requiere rol admin).
    -   `GET /admin/users/:id`: Obtener detalles de un usuario específico (requiere rol admin).
    -   `DELETE /admin/users/:id`: Eliminar un usuario (requiere rol admin).

-   **Parkings (`/api/parkings`)** (Manejado por `parking.routes.js`):
    -   `GET /`: Listar todos los parkings (accesible sin autenticación completa, usa `parkingAccess`).
    -   `GET /:parkingId`: Obtener detalles de un parking (accesible sin autenticación completa, usa `parkingAccess`).
    -   `GET /:parkingId/plantas/:plantaId`: Obtener detalles de una planta (accesible sin autenticación completa, usa `parkingAccess`).
    -   `GET /:parkingId/plantas/:plantaId/plazas/:plazaId`: Obtener detalles de una plaza (accesible sin autenticación completa, usa `parkingAccess`).
    -   `POST /`: Crear un nuevo parking (requiere autenticación y rol admin).
    -   `PUT /:parkingId`: Actualizar un parking (requiere autenticación y rol admin).
    -   `DELETE /:parkingId`: Eliminar un parking (requiere autenticación y rol admin).
    -   `POST /:parkingId/plantas`: Crear planta en parking (requiere autenticación y rol admin).
    -   `DELETE /:parkingId/plantas/:plantaId`: Eliminar planta (requiere autenticación y rol admin).
    -   `POST /:parkingId/plantas/:plantaId/plazas`: Crear plaza en planta (requiere autenticación y rol admin).
    -   `PUT /:parkingId/plantas/:plantaId/plazas/:plazaId`: Actualizar plaza (requiere autenticación y rol admin).
    -   `DELETE /:parkingId/plantas/:plantaId/plazas/:plazaId`: Eliminar plaza (requiere autenticación y rol admin).
    -   `GET /:parkingId/anuncios`: Listar anuncios de un parking (requiere autenticación).
    -   `POST /:parkingId/anuncios`: Crear anuncio (requiere autenticación y rol admin).
    -   `PUT /:parkingId/anuncios/:id`: Actualizar anuncio (requiere autenticación y rol admin).
    -   `DELETE /:parkingId/anuncios/:id`: Eliminar anuncio (requiere autenticación y rol admin).
    -   `GET /:parkingId/reservas`: Listar reservas de un parking (requiere autenticación).
    -   `GET /:parkingId/rapidas`: Listar reservas rápidas de un parking (requiere autenticación y rol admin).
    -   `POST /:parkingId/quick`: Crear reserva rápida (autenticación de dispositivo de parking - `parkingAuth`).
    -   `PATCH /:parkingId/complete`: Completar reserva rápida (requiere autenticación y rol admin).
    -   `GET /:parkingId/eventos`: Listar eventos de sensor de un parking (requiere autenticación y rol admin).
    -   `POST /:parkingId/sensor`: Procesar evento de sensor (autenticación de dispositivo de parking - `parkingAuth`).

-   **Reservas (`/api/reservas`)** (Manejado por `reserva.routes.js`, requiere autenticación para todas las rutas):
    -   `POST /`: Crear una nueva reserva.
    -   `GET /`: Listar todas las reservas del usuario autenticado (activas y otras).
    -   `GET /historial`: Listar historial de reservas del usuario.
    -   `PUT /:reservaId`: Actualizar una reserva.
    -   `PATCH /:reservaId`: Cancelar una reserva.
    -   `DELETE /:reservaId`: Eliminar una reserva (requiere rol admin).

### 📡 Funcionalidades en Tiempo Real (Socket.IO)
-   **Actualización del estado de las plazas**: Evento `parking:updatePlazaState` emitido por el servidor cuando una plaza cambia de estado (ej. finalización de una reserva en una plaza). Crucial para todos los clientes, incluidos los dispositivos del parking.
-   **Notificaciones en tiempo real**: Logs de eventos para el admin procesados a partir de los eventos de los sensores del parking.

### 🔄 Procesamiento de Tareas en Segundo Plano (Jobs)

El backend utiliza BullMQ con Redis para gestionar colas de tareas asíncronas, permitiendo operaciones que no bloquean el flujo principal de peticiones. Esto incluye:

-   **Monitorización de Reservas**: Tareas periódicas para verificar el estado de las reservas (`Reserva` y `ReservaRapida`) (ej. inicio, fin, expiración).
-   **Finalización de Reservas Rápidas**: Tras un evento de salida detectado por un sensor, un job puede encargarse de procesar la finalización de la `ReservaRapida` correspondiente, calcular el costo y actualizar su estado.

## 🛣️ Roadmap y Futuras Mejoras

Aunque APParK es un proyecto completo para los fines de un TFG, existen diversas vías para su expansión y mejora futura:

-   **Integración con Pasarelas de Pago**: Implementar un sistema de pago real para las reservas.
-   **Notificaciones Avanzadas**: Envío de recordatorios de reserva, alertas de tiempo por expirar, etc., mediante email o notificaciones push.
-   **Analíticas Detalladas para Administradores**: Un panel con estadísticas más profundas sobre uso, ingresos, y patrones de ocupación.
-   **Optimización de Asignación de Plazas**: Algoritmos inteligentes para sugerir o asignar las mejores plazas disponibles.
-   **Soporte Multi-idioma**: Internacionalización de la interfaz para usuarios y administradores.
-   **App Móvil Nativa o PWA**: Mejorar la experiencia en dispositivos móviles.

## 📄 Licencia y Naturaleza del Proyecto

**Importante: Proyecto Académico y Ficticio**

APParK es un proyecto desarrollado exclusivamente con **fines académicos** como parte de un Trabajo de Fin de Grado (TFG) del Grado en Ingeniería Informática. 

-   **No es una aplicación comercial ni está conectada a ningún sistema de parkings real.**
-   Cualquier dato sobre parkings, plazas, usuarios o reservas es **completamente ficticio** y generado para la demostración y evaluación del software.
-   Las funcionalidades de reserva, pago (si se simularan), o interacción con sensores **no tienen efecto en el mundo real**.

El código fuente se proporciona con el propósito de evaluación académica. Todos los derechos sobre el diseño y desarrollo original están reservados por el autor.

Si deseas utilizar partes de este código para otros fines, por favor, contacta al autor.