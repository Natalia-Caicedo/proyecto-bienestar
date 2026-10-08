# Revisión de equipo espejo N.º 1

**Equipo revisor:** Los Insanos / Grupo 3 
**Equipo revisado:** Natalia-Caicedo / proyecto-bienestar  
**Fecha:** 2026-10-07 · **Tiempo de revisión:** 1 h 30 min

---

## Valoración por ejes

| Eje | Valoración | Evidencia principal |
| :--- | :---: | :--- |
| **1. Repositorio y trazabilidad** | 2.0 | 60 de 62 commits de un solo autor, solo existe `main`, sin evidencia de PR en el historial. |
| **2. Documentación y reproducibilidad** | 3.0 | El `README` levanta el prototipo sin dependencias, pero hay enlaces rotos y el catálogo arranca vacío (`EV = []`). |
| **3. Arquitectura y calidad del código** | N/A | No aplica para Revisión 1. |
| **4. API, contrato y modelo de datos** | 3.0 | Contrato PDF completo (códigos, errores, roles), pero sin OpenAPI, sin modelo de datos y desalineado del prototipo. |
| **5. Seguridad** | N/A | No aplica para Revisión 1. |
| **6. Interfaz y accesibilidad** | 3.0 | Landmarks, `aria-label` y `:focus-visible` presentes; contraste 2.32:1 en modo oscuro y modal sin gestión de foco. |
| **7. Contenerización, despliegue y pruebas** | N/A | No aplica para Revisión 1. |

---

## Hallazgos

> **Nota:** No se encontraron hallazgos **BLOQUEANTES**; el proyecto levanta siguiendo las instrucciones del `README.md`.

### Hallazgos Importantes

#### [IMPORTANTE] Commits concentrados en un solo autor · Eje 1
* **Qué encontré:** De 62 commits, 60 son de `Natalia-Caicedo` (96.8 %), 2 de `elverrianoes-collab` y ninguno de un tercer integrante; el `README` declara tres integrantes. 44 de los 62 commits son del 2026-10-08.
* **Dónde:** `git shortlog -sne --all`; `README.md` líneas 42-46.
* **Por qué importa:** No hay evidencia de reparto del trabajo ni de que todos conozcan el código. Incumple el criterio de commits distribuidos entre los integrantes.
* **Qué recomiendo:** Que cada integrante haga commits propios sobre su parte (contrato, interfaz, documentación) y completar la columna "Usuario de GitHub" del `README`.

#### [IMPORTANTE] Sin ramas por funcionalidad ni pull requests visibles · Eje 1
* **Qué encontré:** Solo existe la rama `main` y el historial no muestra merges de pull requests.
* **Dónde:** `git branch -a` (solo `main` y `origin/main`); `git log --graph` lineal.
* **Por qué importa:** Todo el trabajo entra directo a `main` sin revisión entre pares, lo que incumple los criterios de ramas y de PR revisados. Además, un documento sin terminar queda siempre en la rama principal.
* **Qué recomiendo:** Trabajar cada tarea en una rama (`feat/contrato-api`, `fix/readme-rutas`) y proteger `main` exigiendo una revisión antes de integrar.

#### [IMPORTANTE] El catálogo arranca vacío y no hay datos de prueba · Eje 2
* **Qué encontré:** El arreglo de eventos se inicializa vacío y el mapa de imágenes también, por lo que la app abre con "No hay eventos para mostrar todavía". Las 5 fotos de `assets/` no se referencian en ningún lado.
* **Dónde:** `eventos-unitropico/eventos-unitropico/assets/pagina-prueba/base.js` líneas 1-2; `docs/WIREFRAMES/README.md` línea 6 ("con estado vacío"); `README.md` línea 53 (anuncia "fotos de los eventos de ejemplo").
* **Por qué importa:** Un evaluador no puede ver el catálogo, los filtros ni la inscripción sin crear eventos a mano. Incumple el criterio de datos de prueba realistas y coherentes con el caso regional.
* **Qué recomiendo:** Cargar un conjunto semilla (p. ej. danza llanera, maratón, yoga, festival de música) usando las imágenes que ya existen, cuando `localStorage` esté vacío.

#### [IMPORTANTE] Rutas y enlaces rotos en la documentación · Eje 2
* **Qué encontré:** El `README` apunta a `eventos-unitropico/eventosunitropico/assets/` (la carpeta real es `eventos-unitropico/eventos-unitropico/assets/`) y a `doc/`, que no existe (la carpeta es `docs/`). En `docs/WIREFRAMES/` el archivo se llama ` 01-inicio.png` (con espacio inicial) y la imagen enlazada en el `README` de esa carpeta no carga.
* **Dónde:** `README.md` líneas 52, 53, 55, 67 y 74; `docs/WIREFRAMES/README.md` línea 13. Al servir el repo, `/eventos-unitropico/eventosunitropico/assets/` y `/doc/` devuelven 404, igual que `/docs/WIREFRAMES/01-inicio.png`.
* **Por qué importa:** Quien lee el `README` no llega a los productos que se describen, y la estructura documentada no coincide con la real.
* **Qué recomiendo:** Corregir los enlaces, renombrar el archivo sin espacio inicial y acortar el anidamiento `eventos-unitropico/eventos-unitropico/assets/pagina-prueba/` (la app no es un "asset").

#### [IMPORTANTE] El contrato está en PDF, no en una especificación OpenAPI · Eje 4
* **Qué encontré:** El contrato vive en un PDF de 8 páginas generado con Word; no hay archivo OpenAPI/Swagger versionado. Además, la sección de actualizar evento no tiene respuesta de ejemplo, y las consultas de inscripciones y usuarios no traen esquema de respuesta.
* **Dónde:** `docs/Contrato-API.pdf`, secciones 8.4, 10.2, 11.1 y 11.2; sección 14 (un único ejemplo de error, `EVENT_FULL`).
* **Por qué importa:** Un PDF no se puede validar contra la implementación ni generar documentación o pruebas de contrato desde él. Incumple el criterio de especificación OpenAPI versionada.
* **Qué recomiendo:** Convertir el contrato a `openapi.yaml` (los endpoints y códigos de la tabla de la sección 12 ya son la base), completar los esquemas faltantes y un catálogo de códigos de error por endpoint.

#### [IMPORTANTE] El contrato y el prototipo describen modelos distintos · Eje 4
* **Qué encontré:** Las categorías del contrato son 4 (Deportivo, Cultural, Académico, Bienestar) y el prototipo tiene 5 (Deporte, Cultura, Académico, Bienestar, Comunidad). El prototipo maneja sede y requisitos, que el contrato no tiene. La inscripción del prototipo pide documento, teléfono, vinculación, programa y consentimiento, mientras el contrato solo recibe `usuario_id`. El alcance del contrato menciona "registro de usuarios" pero no existe un endpoint de registro.
* **Dónde:** `base.js` líneas 24-30 y `admin.js` líneas 39-42 y 90, frente a `docs/Contrato-API.pdf` secciones 3, 7, 9 y 10.1.
* **Por qué importa:** Al conectar el frontend con el backend, los campos y valores de categoría no coincidirán y habrá que rehacer una de las dos partes.
* **Qué recomiendo:** Fijar un único vocabulario (categorías, estados, campos de evento e inscripción), actualizar el contrato o el prototipo, y agregar `POST /auth/registro` o quitarlo del alcance.

#### [IMPORTANTE] Fecha y horario se capturan como texto libre; el contrato exige ISO 8601 · Eje 4
* **Qué encontré:** El formulario de evento usa `<input type="text">` para fecha y horario (ejemplos "26 abr 2026" y "6:00 a.m. – 11:00 a.m."), y los cupos no tienen mínimo ni máximo. El estado "Finalizado" se usa para filtrar el inicio, pero el formulario solo ofrece "Próximo" y "En curso".
* **Dónde:** `admin.js` líneas 85-92; `base.js` línea 111; contrato sección 6 (fechas `AAAA-MM-DD`, horas `HH:MM`).
* **Por qué importa:** No se pueden ordenar ni filtrar eventos por fecha, un evento nunca pasa a finalizado y los datos no se pueden enviar tal cual a la API.
* **Qué recomiendo:** Usar `type="date"` y `type="time"` con almacenamiento ISO, `min="0"` en cupos y calcular el estado a partir de la fecha.

#### [IMPORTANTE] No hay modelo de datos documentado · Eje 4
* **Qué encontré:** No existe diagrama entidad-relación ni descripción de tablas, claves e índices en el repositorio.
* **Dónde:** Todo el repositorio; el contrato (secciones 8-11) solo implica entidades por sus identificadores (`categoria_id`, `usuario_id`, `evento_id`).
* **Por qué importa:** El backend está pendiente y sin modelo acordado no se puede definir la base de datos ni los índices (por ejemplo, `evento+fecha` o `evento+documento` para evitar inscripciones duplicadas).
* **Qué recomiendo:** Agregar `docs/modelo-datos.md` con un diagrama ER (usuarios, eventos, categorías, inscripciones), tipos y restricciones de unicidad.

#### [IMPORTANTE] Contraste insuficiente en el tema oscuro · Eje 6
* **Qué encontré:** El texto blanco sobre el verde del tema oscuro (`#3fbf8c`) tiene un contraste de 2.32:1; afecta botones principales, chips activos y estado "En curso".
* **Dónde:** `styles.css` líneas 3-4 (variables oscuras) y 30, 43 y 52 (`color:#fff` sobre `var(--g)`).
* **Por qué importa:** Incumple el contraste mínimo de 4.5:1 de WCAG 1.4.3 y compromete la meta de Lighthouse de accesibilidad igual o superior a 90.
* **Qué recomiendo:** Usar texto oscuro (`var(--bg)`) sobre el verde claro del tema oscuro, o un verde más oscuro en esos componentes.

#### [IMPORTANTE] El botón de editar evento no tiene icono visible · Eje 6
* **Qué encontré:** El botón de editar en el panel administrativo llama `ic('pencil')`, pero ese icono no está definido en el catálogo de iconos, así que se dibuja un SVG vacío.
* **Dónde:** `admin.js` línea 68; catálogo `P` en `base.js` líneas 3-23 y en `admin.js` líneas 12-17.
* **Por qué importa:** Una persona que ve la pantalla no encuentra cómo editar un evento, una de las funciones centrales del panel. El `aria-label` lo salva solo para lector de pantalla.
* **Qué recomiendo:** Agregar el trazado `pencil` al objeto `P`.

#### [IMPORTANTE] Los diálogos no gestionan el foco · Eje 6
* **Qué encontré:** El modal de inscripción y el de acceso administrativo declaran `role="dialog"` `aria-modal="true"` sin nombre accesible, sin cierre con `Escape`, sin atrapar el foco y sin devolverlo al botón que lo abrió.
* **Dónde:** `admin.js` línea 30 (función modal).
* **Por qué importa:** Con teclado, el foco puede salir del diálogo hacia el contenido que queda detrás, y el lector de pantalla no anuncia el título. Incumple el criterio de recorrer la interfaz completa con teclado.
* **Qué recomiendo:** Agregar `aria-labelledby` al `<h2>`, cerrar con `Escape`, atrapar el foco mientras esté abierto y restaurarlo al cerrar (o usar el elemento `<dialog>`).

---

### Hallazgos Menores

* **[MENOR] Historial poco descriptivo y archivos duplicados o sobrantes · Eje 1**
  * *Qué encontré:* 36 de 62 mensajes de commit son "Update README.md" (15) o "Rename … to …" (21). El contrato está duplicado byte por byte, `app.js` repite el contenido de `admin.js` sin cargarse en ningún lado, `issue.md` está vacío (1 byte) aunque el README lo describe como el informe, y no hay `.gitignore`.
  * *Dónde:* `git log --oneline`; `docs/Contrato-API.pdf` y `docs/Contrato API Eventos Unitropico.pdf` (mismo tamaño, 311311 bytes); `index.html` líneas 12-13 (solo carga `base.js` y `admin.js`); `README.md` línea 57.
  * *Por qué importa:* Cuesta rastrear qué cambió y por qué, y dos copias del contrato pueden divergir.
  * *Qué recomiendo:* Mensajes que digan qué y por qué ("docs: corregir rutas del README"), borrar el contrato y `app.js` duplicados, rellenar o quitar `issue.md` y agregar un `.gitignore`.

* **[MENOR] Plantillas sin completar en el README · Eje 2**
  * *Qué encontré:* Quedan marcadores como "(por completar)", "(rol)", "(@usuario)" y "(ajustar a lo que ya esté hecho)"; el estado del "Prototipo web" figura como pendiente aunque está publicado.
  * *Dónde:* `README.md` líneas 39-46, 52 y 140.
  * *Por qué importa:* Resta credibilidad y contradice el prototipo existente.
  * *Qué recomiendo:* Completar curso, equipo, roles y usuarios, y actualizar el estado del prototipo.

* **[MENOR] Decisiones de arquitectura sin documentar · Eje 2**
  * *Qué encontré:* El README no explica que el prototipo persiste todo en `localStorage` ni que el acceso administrativo usa un PIN provisional.
  * *Dónde:* `admin.js` líneas 5 y 29 (claves de `localStorage`); `README.md` sección "Estado del proyecto".
  * *Por qué importa:* Quien evalúe no sabrá qué es provisional y qué se sustituirá al llegar el backend.
  * *Qué recomiendo:* Agregar una sección breve "Decisiones" con lo provisional del prototipo y el plan de migración a la API.

* **[MENOR] Tarjetas con controles redundantes e insignia de notificaciones fija · Eje 6**
  * *Qué encontré:* Cada tarjeta tiene dos botones que abren el mismo evento (uno con `<div>` y `<p>` dentro, lo cual no es contenido válido en un botón). La insignia "3" de Notificaciones no desaparece nunca y no coincide con la única notificación que se muestra.
  * *Dónde:* `base.js` líneas 89-99 y 173-176; `admin.js` línea 116 (`S.seen` nunca se vuelve `true`).
  * *Por qué importa:* Cada tarjeta añade paradas de Tab innecesarias y la insignia informa algo falso.
  * *Qué recomiendo:* Dejar un solo control por tarjeta (título como enlace o botón) y vincular la insignia al número real de notificaciones no leídas.

---

## Aciertos

* **Fácil despliegue:** El `README` permite levantar el prototipo en menos de diez minutos y sin dependencias. Al servir el repo con `python3 -m http.server`, `index.html` redirige a la ruta real del prototipo y devuelve 200 en todos sus scripts. Además ofrece la alternativa de GitHub Pages.
* **Contrato de API bien definido:** Es sólido en contenido: convenciones ISO 8601, tabla de códigos HTTP con 409 y 422, formato estándar de error, reglas de negocio (cupos, inscripción duplicada, eventos pasados) y matriz de roles y permisos.
* **Bases de accesibilidad:** El prototipo ya trae bases sólidas: `lang="es"`, landmarks `header`/`main`/`nav`, `aria-label` en botones de iconos, `aria-current` en la navegación, `:focus-visible` (`styles.css` línea 10), `prefers-reduced-motion` y tokens de color con tema claro y oscuro.
* **Transparencia:** El `README` declara con transparencia el uso de IA (herramienta, para qué y alcance) y el estado real del backend ("Pendiente").

---

## Prioridades de Acción

1. Repartir el trabajo entre los tres integrantes y pasar a ramas con pull requests revisados (**Eje 1**).
2. Cargar datos semilla y corregir las rutas rotas del README, para que cualquier evaluador vea el catálogo en menos de diez minutos (**Eje 2**).
3. Alinear contrato y prototipo (categorías, estados, fechas ISO, inscripción), pasarlo a OpenAPI y documentar el modelo de datos (**Eje 4**).

---

## Valoración global sugerida: 3.0

**Básico.** El prototipo funciona y el contrato cubre bien lo esencial, pero hay hallazgos importantes en trazabilidad, datos de prueba y alineación contrato-prototipo que conviene atender antes de la siguiente revisión.
