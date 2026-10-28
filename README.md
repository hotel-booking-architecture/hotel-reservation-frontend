# Hotel Reservation Frontend

Aplicación web desarrollada con React para consultar la disponibilidad de habitaciones y calcular tarifas de una cadena hotelera.

## Tecnologías

- React 19
- Vite 8
- JavaScript
- CSS3
- pnpm
- Docker
- Nginx

## Funcionalidades

El sistema permite consultar habitaciones disponibles utilizando los siguientes criterios:

- Sede hotelera: Bogotá, Barranquilla, Cali y Cartagena.
- Fecha de entrada y salida.
- Tipo de habitación: Estándar, Premium o VIP.
- Número de personas.
- Cantidad de habitaciones solicitadas.

Los resultados muestran la disponibilidad, el número de noches, las habitaciones disponibles y el cálculo de tarifas según la temporada.

## Estructura del proyecto

```text
hotel-reservation-frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── hotelService.js
│   ├── styles/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── docs/
│   └── evidencias/
│       ├── formulario_busqueda.png
│       ├── resultado_disponibilidad.png
│       └── docker_frontend.png
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── .dockerignore
├── .env.example
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## Instalación local

Instalar las dependencias:

```bash
pnpm install
```

Iniciar el servidor de desarrollo:

```bash
pnpm dev --host 0.0.0.0
```

Acceder a la aplicación:

http://localhost:5173

## Configuración de la API

El frontend se comunica con FastAPI mediante la variable de entorno:

```env
VITE_API_URL=http://localhost:8000
```

Endpoints utilizados:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/v1/hoteles` | Consultar hoteles |
| GET | `/api/v1/tipos-habitacion` | Consultar categorías |
| GET | `/api/v1/disponibilidad` | Consultar disponibilidad y tarifas |

## Ejecución con Docker

La aplicación utiliza Docker para construir el frontend con Node.js y pnpm, y Nginx para servir los archivos compilados.

Construir e iniciar el contenedor:

```bash
docker compose up -d --build
```

Verificar su estado:

```bash
docker compose ps
```

Acceder a la aplicación dockerizada:

http://localhost:8080

Consultar los registros de ejecución:

```bash
docker compose logs --tail=20 frontend
```

Detener el contenedor:

```bash
docker compose down
```

El backend FastAPI y la base de datos MariaDB deben estar funcionando para realizar consultas.

## Arquitectura

La solución utiliza componentes React para la interfaz y una capa de servicios para centralizar las solicitudes HTTP.

El frontend consume una API REST desarrollada con FastAPI, conectada a una base de datos relacional MariaDB.

La estructura permite incorporar posteriormente el registro de reservas y funcionalidades administrativas.

## Evidencias

Las capturas de ejecución se almacenan en `docs/evidencias/`.

| Archivo | Descripción |
|---|---|
| `formulario_busqueda.png` | Formulario de búsqueda desarrollado en React |
| `resultado_disponibilidad.png` | Resultado de consulta y cálculo de tarifas |
| `docker_frontend.png` | Contenedor del frontend ejecutándose en Docker |

## Compilación

Para generar la versión de producción:

```bash
pnpm build
```

Los archivos compilados se generan en el directorio `dist/`.