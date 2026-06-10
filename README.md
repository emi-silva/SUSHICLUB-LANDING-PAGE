# Sushi Club — Rosario

Sitio web oficial de **Sushi Club Rosario**. Una landing page para un restaurante de sushi artesanal, diseñada para presentar el menú, la identidad del local y gestionar reservas. Incluye un formulario de contacto con envío directo a WhatsApp.

---

## Tecnologías

| Tecnología | Propósito |
|---|---|
| **HTML5** | Maquetado semántico con landmarks ARIA y meta tags Open Graph para compartir en redes sociales. |
| **SCSS (Sass)** | Estilos organizados en partials por sección, compilados con Dart Sass. Variables de color, bucles para delays de animación y mixins para responsive. |
| **JavaScript (Vanilla)** | Sin dependencias externas. IntersectionObserver para animaciones y lazy loading, lightbox navegable, validación de formulario, sistema de notificaciones y envío a WhatsApp. |

---

## Estructura del proyecto

```
sushi.club/
├── index.html              # Página principal
├── styles.css              # CSS compilado (generado por Sass)
├── script.js               # Lógica del frontend
├── package.json            # Scripts de compilación Sass
├── .gitignore
├── README.md
├── scss/
│   ├── main.scss           # Punto de entrada que importa todos los partials
│   ├── _variables.scss     # Paleta de colores, tipografía, radios, sombras
│   ├── _reset.scss         # Normalización de estilos base
│   ├── _nav.scss           # Barra de navegación fija con menú responsive
│   ├── _hero.scss          # Portada principal
│   ├── _sections.scss      # Estilos compartidos entre secciones
│   ├── _menu.scss          # Tarjetas del menú con delays escalonados
│   ├── _about.scss         # Sección "Sobre nosotros" con imagen y stats
│   ├── _gallery.scss       # Grilla de imágenes con carga diferida
│   ├── _testimonials.scss  # Opiniones de clientes
│   ├── _contact.scss       # Información de contacto y formulario de reserva
│   ├── _footer.scss        # Pie de página
│   ├── _animations.scss    # Animaciones de entrada con soporte para prefers-reduced-motion
│   ├── _lightbox.scss      # Visor de imágenes a pantalla completa
│   ├── _toast.scss         # Notificaciones temporales
│   └── _scroll-top.scss    # Botón de desplazamiento al inicio
└── images/
    ├── hero-sashimi.jpg
    ├── about-interior.jpg
    ├── sushi_plate.jpg
    ├── tuna_rolls.jpg
    └── ... (17 imágenes en total)
```

### Compilación de estilos

Los archivos fuente se encuentran en `scss/`. Para compilar:

```bash
npm run build:css       # Compila una vez
npm run watch:css       # Compila automáticamente al guardar cambios
```

El resultado se escribe en `styles.css`, que es el archivo referenciado por `index.html`.

---

## Secciones del sitio

### Portada (Hero)
Presentación principal con imagen destacada de sashimi, título, descripción y dos botones de acción: "Reservar Mesa" y "Ver Menú". Incluye un gradiente radial con los colores de la marca como fondo decorativo.

### Menú
Doce platos con nombre, descripción y precio en pesos argentinos. Cada tarjeta tiene un efecto hover que la eleva ligeramente y resalta el borde. Las animaciones de entrada están escalonadas mediante un bucle `@for` en Sass.

### Sobre Nosotros
Fotografía real del interior del restaurante (`images/about-interior.jpg`) acompañada de la historia del local y tres indicadores: años de experiencia, clientes atendidos y platos exclusivos. Los valores numéricos se animan al hacerles scroll.

### Galería
Doce imágenes de platos en grilla con carga diferida (lazy loading). Las imágenes se cargan únicamente cuando el usuario se aproxima a ellas, optimizando el rendimiento inicial. Al hacer clic se abre un lightbox que permite navegar entre imágenes con botones o con las teclas ← →.

### Opiniones
Seis testimonios de clientes con valoraciones de estrellas (variadas entre 4 y 5 para mayor credibilidad), nombre y reseña.

### Contacto / Reserva
Datos reales del restaurante:
- **Dirección:** Blvd. Oroño 70, Rosario, Santa Fe
- **Teléfono:** +54 341 437-2809 (enlace `tel:`)
- **Email:** sushiclubrosario@gmail.com (enlace `mailto:`)
- **Horarios:** Lun–Mié 12–01, Jue 12–01:30, Vie–Sáb 12–02, Dom 12–01

El formulario de reserva valida en tiempo real los campos obligatorios (nombre, email, fecha, hora). La fecha se inicializa con el día siguiente. Al enviar, abre WhatsApp con el mensaje de reserva prearmado y muestra una notificación de confirmación.

---

## Paleta de colores

| Color | Uso |
|---|---|
| `#0a0a0a` | Fondo general |
| `#dc143c` | Acento principal (botones, enlaces, detalles) |
| `#b01030` | Hover de acento |
| `#f5f5f5` | Texto principal |
| `#a3a3a3` | Texto secundario y placeholders |
| `#ff3333` | Indicación de error en formularios |
| `#cc1111` | Fondo de notificación de error |
| `#16a34a` | Fondo de notificación de éxito |
| `#fbbf24` | Estrellas de valoración |

Tipografía: **Playfair Display** (serif) para títulos y **Inter** (sans-serif) para el cuerpo. Ambas cargadas desde Google Fonts con precarga de conexión.

---

## Funcionalidades de JavaScript

Todo el comportamiento del frontend está implementado en `script.js` sin librerías externas:

1. **Menú responsive** — toggle hamburguesa con indicador `aria-expanded`. Se cierra al seleccionar una opción.
2. **Scroll suave** — navegación interna mediante `scrollIntoView` con comportamiento smooth.
3. **Nav compacta** — la barra de navegación se reduce al hacer scroll hacia abajo.
4. **Sección activa** — `IntersectionObserver` detecta qué sección está visible y marca el enlace correspondiente.
5. **Animaciones al scroll** — los elementos con clase `.reveal` aparecen progresivamente al entrar al viewport. Respeta `prefers-reduced-motion`.
6. **Carga diferida de imágenes** — `IntersectionObserver` con margen de 200px aplica las imágenes de la galería cuando están próximas a visualizarse.
7. **Contador animado** — las estadísticas de "Sobre Nosotros" incrementan su valor numérico con easing cúbico.
8. **Lightbox navegable** — visor de imágenes con navegación entre elementos del mismo grupo. Soporta teclado (← →, Escape).
9. **Validación de formulario** — verifica campos requeridos y formato de email. Muestra mensajes de error contextuales.
10. **Envío a WhatsApp** — al confirmar la reserva, redirige a WhatsApp Web con el mensaje completo.
11. **Notificaciones Toast** — mensajes emergentes con duración de 4 segundos y animación de entrada/salida.
12. **Volver arriba** — botón fijo que aparece al superar los 400px de scroll.

---

## Cómo ejecutar el proyecto

Al ser un sitio estático, puede abrirse directamente en el navegador:

```bash
# Servidor local con Python
python -m http.server 8000

# Servidor local con Node
npx serve .

# VS Code: clic derecho en index.html → "Open with Live Server"
```

---

## Observaciones

- Los datos de contacto, horarios y dirección corresponden al Sushi Club Rosario real (Blvd. Oroño 70).
- Las imágenes de la galería y el menú son fotografías reales de platos.
- No se requiere conexión a base de datos ni servidor backend; las reservas se gestionan a través de WhatsApp.
