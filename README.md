# Eventos Unitrópico

Sistema web de eventos de Bienestar Universitario de Unitrópico: reúne en un solo lugar los eventos de la universidad, permite filtrarlos por categoría, inscribirse y, para el personal autorizado, publicar, corregir y eliminar eventos.

| | |
|---|---|
| 🌐 **Prototipo publicado** | [Ver prototipo en GitHub Pages]( https://natalia-caicedo.github.io/proyecto-bienestar/) |
| 📄 **Contrato de la API** | [`docs/Contrato-API.pdf`](docs/Contrato-API.pdf) |
| 🏷️ **Versión** | 1.0 *(ajustar si cambia)* |

## Tabla de contenido

1. [El problema](#el-problema)
2. [Curso y equipo](#curso-y-equipo)
3. [Qué hay en este repositorio](#qué-hay-en-este-repositorio)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Cómo ejecutarlo en local](#cómo-ejecutarlo-en-local)
6. [Contrato de la API](#contrato-de-la-api)
7. [Estado del proyecto](#estado-del-proyecto)
8. [Uso de inteligencia artificial](#uso-de-inteligencia-artificial)

## El problema

La información de los eventos de Unitrópico (deportivos, culturales, académicos y de bienestar) está dispersa. Hoy se publica principalmente en Facebook e Instagram, donde cada publicación nueva desplaza a las anteriores. Por eso, un evento anunciado hace pocos días queda enterrado entre otras publicaciones y es difícil de encontrar.

Esto genera varias dificultades:

- **Información que se pierde:** fechas, horas y lugares quedan sepultados bajo las publicaciones más recientes.
- **Sin una vista única:** no hay un solo sitio donde ver qué eventos vienen, ni cuáles ya se realizaron.
- **Sin filtros:** la persona no puede buscar por categoría ni por fecha.
- **Inscripción poco clara:** no hay un medio claro para inscribirse ni para saber cuántos cupos quedan.

**Eventos Unitrópico** propone un sistema web que reúne todos los eventos en un solo catálogo, con filtros por categoría y fecha, y con inscripción en línea. Las personas autorizadas de Bienestar Universitario pueden publicar, corregir y eliminar eventos desde un mismo lugar.

## Curso y equipo

| Dato | Valor |
|------|-------|
| Curso | *(por completar)* |
| Equipo / Grupo | *(por completar)* |

| Integrante | Rol | Usuario de GitHub |
|------------|-----|-------------------|
| Maryi Natalia Caicedo Barreto | *(rol)* | *(@usuario)* |
| Angie Zarith Viancha Tumay | *(rol)* | *(@usuario)* |
|Daniel Gómez Pidiache | *(rol)* | *(@usuario)* |

## Qué hay en este repositorio

| Producto | Dónde | Qué es |
|----------|-------|--------|
| Prototipo navegable | [`eventos-unitropico/eventosunitropico/assets/pagina-prueba/`](eventos-unitropico/eventosunitropico/assets/pagina-prueba/) | Catálogo de eventos con filtros, tarjetas y barra de navegación inferior; parte administrativa y formulario de inscripción *(ajustar a lo que ya esté hecho)*. |
| Imágenes | [`eventos-unitropico/eventosunitropico/assets/`](eventos-unitropico/eventosunitropico/assets/) | Logo de Unitrópico y fotos de los eventos de ejemplo (danza llanera, festival de música, herramientas digitales, maratón, yoga). |
| Contrato de API | [`docs/Contrato-API.pdf`](docs/Contrato-API.pdf) | API REST v1: autenticación, eventos, categorías, inscripciones y usuarios, con estructuras JSON, códigos de respuesta y reglas de negocio. |
| Anteproyecto | [`doc/`](doc/) | Documento de anteproyecto de la primera entrega. |
| Evidencias | [`docs/`](docs/) | Archivo `evidencias` y capturas de pantalla de WhatsApp. |
| Informe | [`issue.md`](issue.md) | Informe registrado como issue. |
| Página de entrada | [`index.html`](index.html) | Redirige a la página principal del prototipo. |

## Estructura del proyecto

```text
proyecto-bienestar/
├── README.md
├── index.html                     Redirige a la página principal del prototipo
├── issue.md                       Informe
├── doc/
│   └── anteproyecto               Anteproyecto (primera entrega)
├── docs/
│   ├── Contrato-API.pdf           Contrato de la API REST
│   ├── evidencias                 Evidencias del proyecto
│   └── WhatsApp Image ...jpeg     Capturas de pantalla
└── eventos-unitropico/
    └── eventosunitropico/
        └── assets/
            ├── pagina-prueba/     Prototipo web
            ├── danza-llanera.jpg
            ├── festival-musica.jpg
            ├── herramientas-digitales.jpg
            ├── logo-unitropico.jpg
            ├── maraton.jpg
            └── yoga.jpg
```

## Cómo ejecutarlo en local

**Opción 1: ver el prototipo publicado.** Abre el enlace de GitHub Pages que está al inicio de este README. No necesitas instalar nada.

**Opción 2: en tu computador.**

1. Clona el repositorio:

```bash
   git clone https://github.com/Natalia-Caicedo/proyecto-bienestar.git
   cd proyecto-bienestar
```

2. Levanta un servidor local desde la raíz del repositorio (necesitas Python 3):

```bash
   python3 -m http.server 8080
```

   En Windows usa `py -m http.server 8080`. También sirve la extensión **Live Server** de VS Code.

3. Abre <http://localhost:8080> en el navegador. `index.html` te lleva al prototipo.

## Contrato de la API

Resumen. El detalle completo (solicitudes, respuestas, errores y reglas de negocio) está en [`docs/Contrato-API.pdf`](docs/Contrato-API.pdf).

| Dato | Valor |
|------|-------|
| Versión | v1 |
| Base URL (propuesta) | `https://api.eventos.unitropico.edu.co/api/v1` |
| Formato | JSON, UTF-8, HTTPS |
| Autenticación | Bearer Token / JWT en recursos protegidos |

| Método | Endpoint | Autenticación | Uso |
|--------|----------|:-------------:|-----|
| POST | `/auth/login` | No | Inicio de sesión |
| POST | `/auth/logout` | Sí | Cerrar sesión |
| GET | `/eventos` | No | Listar/filtrar eventos |
| GET | `/eventos/{id}` | No | Consultar evento |
| POST | `/eventos` | Sí | Crear evento |
| PUT | `/eventos/{id}` | Sí | Actualizar evento |
| DELETE | `/eventos/{id}` | Sí | Eliminar evento |
| GET | `/categorias` | No | Listar categorías |
| POST | `/eventos/{id}/inscripciones` | Sí | Registrar inscripción |
| GET | `/usuarios/{id}/inscripciones` | Sí | Consultar inscripciones |
| DELETE | `/inscripciones/{id}` | Sí | Cancelar inscripción |
| GET | `/usuarios/{id}` | Sí | Consultar usuario |
| PUT | `/usuarios/{id}` | Sí | Actualizar usuario |

## Estado del proyecto

| Pieza | Estado |
|-------|--------|
| Anteproyecto | ✅ Entregado |
| Prototipo web | *(por completar)* |
| Contrato de API | ✅ Definido (v1.0) |
| Backend y base de datos | ⏳ Pendiente |

## Uso de inteligencia artificial

| Herramienta | Para qué | Alcance |
|-------------|----------|---------|
| Claude (Anthropic), mediante el chat de claude.ai | Organizar y redactar el README; redactar el planteamiento del problema; convertir a formato Markdown las tablas del contrato de la API (endpoints, códigos HTTP y roles); ordenar el CSS del prototipo. | Borradores y apoyo de redacción y formato. Las decisiones del proyecto, el contenido del contrato y la revisión final son del equipo. |
