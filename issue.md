## Revisión de equipo espejo N.º 1
**Equipo revisor:** Los Insanos/ Grupo 3
**Equipo revisado:** Natalia-Caicedo / proyecto-bienestar
**Fecha:** 7 de octubre de 2026 · **Tiempo de revisión:** ≈ 1 h 45 min 

> **Método y límites.** Se clonó el repositorio desde cero (`main`, commit `901f4a5`), se leyó el 100 % del código fuente (5 archivos, ~520 líneas), se recorrió el historial (`git log --all`), se verificó la sintaxis de los scripts con `node --check` y se calcularon las relaciones de contraste a partir de los tokens de `styles.css`. **No se ejecutó** Lighthouse, ni el recorrido solo con Tab, ni el zoom al 200 %, ni se revisaron las pestañas Issues / Projects / Pull requests de GitHub; los hallazgos que dependen de ello lo indican. El README no contiene pasos, por lo que no hay procedimiento que cronometrar (ver hallazgo 1).

### Valoración por ejes
| Eje | Valoración | Evidencia principal |
| --- | --- | --- |
| 1. Repositorio y trazabilidad | 2.0 | 16/16 commits de una sola cuenta frente a 3 integrantes declarados; todo en `main`, sin ramas ni PR; mensajes genéricos ("Add files via upload"). |
| 2. Documentación y reproducibilidad | 1.0 | `README.md` contiene solo el título; sin requisitos, pasos ni datos de prueba (`const EV = []`): la app abre vacía. |
| 3. Arquitectura y calidad del código | N/A | No aplica para Revisión 1 |
| 4. API, contrato y modelo de datos | 1.0 | No existe API, especificación OpenAPI ni modelo de datos documentado; la lógica de cupos y registro vive en `localStorage`. |
| 5. Seguridad | N/A | No aplica para Revisión 1 |
| 6. Interfaz y accesibilidad | 3.0 | Base sólida (`lang`, `aria-label`, `:focus-visible`, tema oscuro); contraste insuficiente en modo oscuro, icono de edición sin definir y badge fijo. |
| 7. Contenerización, despliegue y pruebas | N/A | No aplica para Revisión 1 |

### Hallazgos

#### [BLOQUEANTE] Eje 2 · Documentación y reproducibilidad
- **Qué encontré:** El README contiene únicamente el título `# proyecto-bienestar`; no indica cómo abrir ni ejecutar el prototipo.
- **Dónde:** [`README.md`](https://github.com/Natalia-Caicedo/proyecto-bienestar/blob/main/README.md), línea 1 (archivo de 20 bytes).
- **Por qué importa:** Un evaluador que clona el repositorio no puede levantar ni probar el prototipo en menos de 10 minutos, criterio central del eje. Además, la ruta real de la app (`eventos-unitropico/eventos-unitropico/assets/pagina-prueba/`) solo se descubre leyendo el `index.html` raíz.
- **Qué recomiendo:** Agregar en el README: descripción del proyecto, requisitos previos (navegador, o servidor estático si se usa uno), pasos numerados para abrir el prototipo, ruta de la app, PIN de demostración del panel admin y estructura de carpetas.
- **Severidad:** BLOQUEANTE

#### [BLOQUEANTE] Eje 4 · API, contrato y modelo de datos
- **Qué encontré:** No existe ninguna API, especificación OpenAPI ni documento de contrato; los eventos, inscripciones y cupos se gestionan solo en el navegador mediante `localStorage` (`utp_events_v1`, `utp_regs_v1`).
- **Dónde:** [`admin.js`](https://github.com/Natalia-Caicedo/proyecto-bienestar/blob/main/eventos-unitropico/eventos-unitropico/assets/pagina-prueba/admin.js#L5-L10) líneas 5–10 y 29 (`saveE`); `base.js` línea 32 (`STATE_KEY`). Búsqueda de `openapi`, `swagger`, `*.yaml`, `*.json` en el repositorio: sin resultados.
- **Por qué importa:** La Revisión 1 evalúa el contrato de API posterior a la Entrega 2. Sin él, no se puede verificar códigos HTTP, validación en servidor ni manejo de errores, y el prototipo no puede cumplir lo que el propio anteproyecto plantea como problema: "control de cupos en tiempo real" (`docs/evidencias`, Figura 1), ya que un cupo restado en un navegador no se refleja en otro. El plan del anteproyecto (línea 15) ubica la API en las semanas 5–6, por lo que conviene confirmar con el docente si el contrato era exigible en este corte.
- **Qué recomiendo:** Escribir un `openapi.yaml` versionado en el repositorio con, como mínimo: `GET /eventos`, `GET /eventos/{id}`, `POST /eventos/{id}/inscripciones`, `DELETE /inscripciones/{id}`, `POST/PUT/DELETE /eventos` (admin) y `GET /eventos/{id}/inscritos`, con esquemas de petición/respuesta, códigos de éxito (200/201/204) y error (400/404/409/422) y un formato de error único.
- **Severidad:** BLOQUEANTE

#### [IMPORTANTE] Eje 4 · API, contrato y modelo de datos
- **Qué encontré:** El modelo de datos no está documentado y usa claves abreviadas sin esquema (`t, c, d, h, l, s, cu, tot, st, desc, req, url, img` para eventos; `n, d, c, t, v, p, f` para inscripciones).
- **Dónde:** [`admin.js`](https://github.com/Natalia-Caicedo/proyecto-bienestar/blob/main/eventos-unitropico/eventos-unitropico/assets/pagina-prueba/admin.js#L83) línea 83 (objeto por defecto) y línea 100 (`saveEv`); línea 49 (`REG.push`).
- **Por qué importa:** Sin diccionario de datos, quien diseñe la API o la base de datos debe deducir el significado de cada campo del código, con riesgo de inconsistencias entre front y back. Tampoco hay identificadores definidos ni índices previstos (p. ej., unicidad evento + documento, hoy comprobada solo en memoria en la línea 48).
- **Qué recomiendo:** Documentar en `docs/` un diagrama o tabla de entidades (Evento, Inscripción, Usuario/Administrador) con nombres completos, tipos, restricciones y claves; usar esos mismos nombres en el contrato OpenAPI.
- **Severidad:** IMPORTANTE

#### [IMPORTANTE] Eje 4 · API, contrato y modelo de datos
- **Qué encontré:** Toda la validación de entradas ocurre en el navegador (atributos `required`, `type="email"`, función `cl()` que solo elimina `<` y `>`), y el acceso al panel administrativo se resuelve comparando un PIN fijo `'1234'` contenido en el propio script.
- **Dónde:** [`admin.js`](https://github.com/Natalia-Caicedo/proyecto-bienestar/blob/main/eventos-unitropico/eventos-unitropico/assets/pagina-prueba/admin.js#L5) línea 5 (`PIN='1234'`), línea 57 (`login`), línea 28 (`cl`), líneas 36–44 (formulario de inscripción).
- **Por qué importa:** Cualquier visitante puede leer el PIN en el código fuente y las reglas de validación no se aplicarían a un cliente distinto del navegador. No hay hoy un contrato que defina qué rechaza el servidor (formato de documento, teléfono, longitudes). La autenticación real se evalúa en la Revisión 2; aquí se señala porque el diseño del contrato debe contemplarla.
- **Qué recomiendo:** Definir en el contrato la validación de cada campo (formato, longitud, obligatoriedad) y un mecanismo de autenticación para las rutas de administración; mantener el PIN solo como credencial de demostración documentada en el README.
- **Severidad:** IMPORTANTE

#### [IMPORTANTE] Eje 1 · Repositorio y trazabilidad
- **Qué encontré:** Los 16 commits del repositorio provienen de una sola cuenta de autor, mientras el anteproyecto declara tres integrantes.
- **Dónde:** `git shortlog -sne --all` → 16 commits, 1 autor; [`doc/anteproyecto`](https://github.com/Natalia-Caicedo/proyecto-bienestar/blob/main/doc/anteproyecto) línea 3 (equipo de tres).
- **Por qué importa:** No hay evidencia en el historial de la distribución del trabajo entre integrantes, requisito explícito del eje. Tampoco se verificó la pestaña Projects/Issues; si existe un tablero, debe enlazarse desde el README.
- **Qué recomiendo:** Que cada integrante haga commits con su propia identidad (`git config user.name/email`) sobre su parte del trabajo y enlazar el tablero de tareas en el README.
- **Severidad:** IMPORTANTE

#### [IMPORTANTE] Eje 1 · Repositorio y trazabilidad
- **Qué encontré:** Todo el trabajo se integra directamente en `main`; no existen otras ramas ni evidencia de pull requests.
- **Dónde:** `git branch -a` → solo `main` y `origin/main`; historial lineal desde `c123309` hasta `901f4a5`.
- **Por qué importa:** Sin ramas por funcionalidad ni revisión entre pares, no hay control de calidad previo a integrar, y cualquier error llega directo a la rama principal que se evaluará.
- **Qué recomiendo:** Trabajar con ramas `feature/*` y pull requests con al menos una aprobación de otro integrante antes de fusionar; activar la protección de `main` en la configuración del repositorio.
- **Severidad:** IMPORTANTE

#### [IMPORTANTE] Eje 2 · Documentación y reproducibilidad
- **Qué encontré:** La aplicación no incluye datos de prueba: el arreglo de eventos inicia vacío, por lo que al abrir el prototipo se muestra "No hay eventos para mostrar todavía".
- **Dónde:** [`base.js`](https://github.com/Natalia-Caicedo/proyecto-bienestar/blob/main/eventos-unitropico/eventos-unitropico/assets/pagina-prueba/base.js#L1) línea 1 (`const EV = [];`) y línea 108 (estado vacío). Las 5 imágenes de `assets/` (`yoga.jpg`, `maraton.jpg`, `danza-llanera.jpg`, `festival-musica.jpg`, `herramientas-digitales.jpg`) no se referencian desde ningún archivo.
- **Por qué importa:** Un evaluador no puede ver el catálogo, el detalle ni el flujo de inscripción sin antes crear eventos manualmente con el PIN; el eje exige datos de prueba realistas y coherentes con el caso regional.
- **Qué recomiendo:** Cargar un conjunto inicial de eventos (por ejemplo, los 5 que ya tienen imagen, con fechas, sedes y cupos de Yopal/Unitrópico) cuando `localStorage` esté vacío, o un archivo `seed` documentado en el README.
- **Severidad:** IMPORTANTE

#### [IMPORTANTE] Eje 2 · Documentación y reproducibilidad
- **Qué encontré:** Los wireframes y las decisiones de diseño mencionados en el anteproyecto no están en el repositorio, y no hay documento que explique las decisiones de arquitectura.
- **Dónde:** [`doc/anteproyecto`](https://github.com/Natalia-Caicedo/proyecto-bienestar/blob/main/doc/anteproyecto) línea 11 (cita wireframes de Home, Detalle, Mis Inscripciones con QR, Admin); búsqueda de imágenes o archivos de diseño: solo `docs/*.jpeg` (capturas de evidencias).
- **Por qué importa:** No se puede contrastar el prototipo con el diseño comprometido ni entender por qué se eligió la estructura actual (`base.js` + `admin.js` que "redefine render()").
- **Qué recomiendo:** Subir los wireframes a `docs/` y crear un archivo breve de decisiones (por ejemplo `docs/decisiones.md`) con stack, estructura de carpetas y razones.
- **Severidad:** IMPORTANTE

#### [IMPORTANTE] Eje 6 · Interfaz y accesibilidad
- **Qué encontré:** En modo oscuro, el texto blanco sobre el color de acento `#3fbf8c` tiene una relación de contraste de 2.32:1 (mínimo WCAG AA: 4.5:1 en texto normal).
- **Dónde:** [`styles.css`](https://github.com/Natalia-Caicedo/proyecto-bienestar/blob/main/eventos-unitropico/eventos-unitropico/assets/pagina-prueba/styles.css#L4) línea 4 (`--g:#3fbf8c`) combinada con línea 52 (`.btn`), línea 30 (`.chip.on`), línea 43 (`.st.live`). Pantallas: "Ver evento", "Inscribirme", chips activos del panel admin, con el tema oscuro activo.
- **Por qué importa:** Los botones principales resultan difíciles de leer para usuarios con baja visión y se incumple el criterio de accesibilidad de contraste; es probable que Lighthouse lo reporte.
- **Qué recomiendo:** En el tema oscuro usar texto oscuro (p. ej. `#0c1713`, ≈ 8:1) sobre el acento claro, o un acento más oscuro para fondos con texto blanco. Verificar con Lighthouse y con un medidor de contraste.
- **Severidad:** IMPORTANTE

#### [IMPORTANTE] Eje 6 · Interfaz y accesibilidad
- **Qué encontré:** El botón de editar evento del panel admin invoca un icono inexistente (`ic('pencil')`), por lo que se renderiza un `<svg>` vacío.
- **Dónde:** [`admin.js`](https://github.com/Natalia-Caicedo/proyecto-bienestar/blob/main/eventos-unitropico/eventos-unitropico/assets/pagina-prueba/admin.js#L68) línea 68; el objeto `P` (iconos) en `base.js` líneas 3–23 y `admin.js` líneas 12–17 no define la clave `pencil`.
- **Por qué importa:** Para usuarios que ven la pantalla, el botón de edición aparece como un área en blanco junto al icono de papelera, sin indicar su función; la acción de editar es parte del flujo administrativo.
- **Qué recomiendo:** Agregar la entrada `pencil` al objeto `P` con su trazado SVG.
- **Severidad:** IMPORTANTE

#### [MENOR] Eje 6 · Interfaz y accesibilidad
- **Qué encontré:** El contador de la pestaña Notificaciones es un valor fijo "3" que nunca desaparece, aunque solo existe una notificación y `S.seen` nunca se actualiza.
- **Dónde:** [`admin.js`](https://github.com/Natalia-Caicedo/proyecto-bienestar/blob/main/eventos-unitropico/eventos-unitropico/assets/pagina-prueba/admin.js#L116) línea 116 (`<span class="dot">3</span>`); `base.js` línea 33 (`seen:false`) y líneas 173–176 (`notif()` muestra una sola).
- **Por qué importa:** Informa un dato falso al usuario; además, el texto blanco 10 px sobre `#d9534f` tiene contraste 3.96:1 (`styles.css` línea 90).
- **Qué recomiendo:** Calcular el número desde los datos reales, poner `S.seen=true` al abrir la vista y usar un rojo más oscuro.
- **Severidad:** MENOR

#### [MENOR] Eje 6 · Interfaz y accesibilidad
- **Qué encontré:** El diálogo modal declara `role="dialog" aria-modal="true"` pero no tiene nombre accesible, ni cierre con la tecla Escape, ni retención del foco.
- **Dónde:** [`admin.js`](https://github.com/Natalia-Caicedo/proyecto-bienestar/blob/main/eventos-unitropico/eventos-unitropico/assets/pagina-prueba/admin.js#L30) línea 30 (`modal`). Pantallas: formulario de inscripción y acceso administrativo.
- **Por qué importa:** Con teclado, el foco puede salir del diálogo hacia el contenido que queda oculto visualmente y un lector de pantalla no anuncia el título del diálogo. (Pendiente confirmar recorriendo la interfaz solo con Tab.)
- **Qué recomiendo:** Añadir `aria-labelledby` apuntando al `<h2>`, cerrar con Escape y devolver el foco al botón que abrió el modal.
- **Severidad:** MENOR

#### [MENOR] Eje 6 · Interfaz y accesibilidad
- **Qué encontré:** Los títulos de eventos se insertan sin escapar en el HTML del formulario de inscripción y del panel admin, incluso dentro de atributos (`aria-label="Editar ${e.t}"`), mientras que en el catálogo sí se escapan con `safe()`.
- **Dónde:** [`admin.js`](https://github.com/Natalia-Caicedo/proyecto-bienestar/blob/main/eventos-unitropico/eventos-unitropico/assets/pagina-prueba/admin.js#L37) línea 37, líneas 67–69 y línea 72; la función `cl` (línea 28) elimina `<` y `>` pero no comillas.
- **Por qué importa:** Un título con comillas dobles rompe el atributo y puede desordenar el marcado del panel; se trata de manera inconsistente el mismo dato según la pantalla. La revisión de inyección en profundidad corresponde al eje 5 (Revisión 2).
- **Qué recomiendo:** Usar `esc()` en todas las interpolaciones de texto del panel y del formulario.
- **Severidad:** MENOR

#### [MENOR] Eje 1 · Repositorio y trazabilidad
- **Qué encontré:** Los mensajes de commit no indican qué cambió ni por qué: "Add files via upload" (×3), "Update anteproyecto" (×3), "correccion archivos", "redigiri a la pagina raiz", "Rename anteproyecto to anteproyecto".
- **Dónde:** `git log --oneline`: `1a8f21f`, `4c7aaf4`, `1a1cb80`, `2d31601`, `672dba7`, `c4ad873`, `901f4a5`, `95b0703`.
- **Por qué importa:** El historial no permite reconstruir qué se hizo en cada entrega ni localizar un cambio concreto. Además, un archivo comprimido (`eventos-unitropico. (2).zip`, ≈ 0.1 MB, commit `4c7aaf4`) se subió y se eliminó en `97a7484`; sigue en el historial como copia duplicada del código.
- **Qué recomiendo:** Adoptar mensajes con formato "verbo + qué + por qué" (p. ej. `feat: agregar filtro por categoría en catálogo`) y no versionar archivos comprimidos.
- **Severidad:** MENOR

#### [MENOR] Eje 1 · Repositorio y trazabilidad
- **Qué encontré:** La estructura tiene carpetas duplicadas y archivos sin extensión: `doc/` y `docs/`, `eventos-unitropico/eventos-unitropico/`, `anteproyecto` y `evidencias` sin `.md`; el anteproyecto indica `/documentos/...`, que no existe.
- **Dónde:** `doc/anteproyecto`, `docs/evidencias`, [`doc/anteproyecto`](https://github.com/Natalia-Caicedo/proyecto-bienestar/blob/main/doc/anteproyecto) línea 9. Las figuras listadas (`evidencia1_cursos_libres_forms.jpg`…) no coinciden con los archivos `WhatsApp Image 2026-09-17 …jpeg` de `docs/`.
- **Por qué importa:** Dificulta ubicar la documentación y verificar que cada figura citada corresponde a un archivo.
- **Qué recomiendo:** Unificar en una sola carpeta `docs/`, renombrar a `.md`, aplanar la carpeta anidada y renombrar las imágenes según las figuras que citan.
- **Severidad:** MENOR

#### [MENOR] Eje 1 · Repositorio y trazabilidad
- **Qué encontré:** El archivo `app.js` duplica casi línea por línea a `admin.js` y no se carga desde ningún HTML (`index.html` incluye solo `base.js` y `admin.js`).
- **Dónde:** [`app.js`](https://github.com/Natalia-Caicedo/proyecto-bienestar/blob/main/eventos-unitropico/eventos-unitropico/assets/pagina-prueba/app.js) (112 líneas) frente a `admin.js` (117 líneas); `index.html` líneas 12–13.
- **Por qué importa:** Un archivo muerto genera dudas sobre cuál es la versión vigente y puede editarse por error sin efecto en la app.
- **Qué recomiendo:** Eliminar `app.js` y, cuando corresponda, fusionar `admin.js` en la estructura definitiva.
- **Severidad:** MENOR

### Aciertos
1. **Accesibilidad de base bien resuelta.** `<html lang="es">`, botones con solo icono con `aria-label` (`base.js` líneas 90–91), `aria-current="page"` en la navegación (`admin.js` línea 116), `:focus-visible` con contorno de 3 px (`styles.css` línea 10), `prefers-reduced-motion` (línea 99) y tema claro/oscuro con `prefers-color-scheme` (líneas 3–4).
2. **Control de cupos consistente en la lógica del cliente.** Rechaza inscripción duplicada por documento (`admin.js` línea 48), impide inscribir sin cupos (línea 47), restituye el cupo al cancelar con tope en el total (línea 51) y limita los cupos disponibles al total al editar (línea 100).
3. **Escapado sistemático en el catálogo y el detalle.** La función `safe()` (`base.js` líneas 78–80) se aplica a los datos de eventos en tarjetas y detalle, y `esc()` a los datos de inscritos en el panel (`admin.js` línea 73).
4. **Problema validado con evidencia fechada.** `docs/evidencias` vincula cada figura (02/09, 07/09, 22/08 y 17/09 de 2026) con la funcionalidad que la justifica, lo que da trazabilidad entre el problema y las rutas elegidas.
5. **Formularios con etiquetas y consentimiento.** Cada campo del formulario de inscripción está envuelto en su `<label>` (`admin.js` línea 34) e incluye casilla de autorización de datos personales (línea 42).

### Prioridades
1. Escribir el README (requisitos, pasos, ruta de la app, PIN de demo) y cargar datos de prueba iniciales para que el prototipo se pueda levantar y recorrer en menos de 10 minutos.
2. Entregar el contrato de API (`openapi.yaml`) junto con el diccionario de datos, definiendo códigos de estado, validaciones por campo y formato de error.
3. Establecer el flujo de trabajo en equipo: ramas por funcionalidad, pull requests revisados y commits de cada integrante con mensajes descriptivos.
4. Corregir el contraste del tema oscuro, el icono `pencil` faltante y el contador fijo de notificaciones; verificar con Lighthouse y navegación por teclado.

### Valoración global sugerida: 1.5
