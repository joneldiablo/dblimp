# DBLimp Monorepo

Monorepo de componentes y utilidades desacopladas en TypeScript para interfaces web guiadas por esquemas JSON (Goat Engine), Bootstrap 5 y bibliotecas complementarias del ecosistema React.

## Visión General

`imp-ts` es la evolución modular y tipada en TypeScript del framework `dbl-components`. Está estructurado como un monorepo administrado con **Yarn Workspaces**, permitiendo la publicación y consumo independiente de cada paquete bajo el scope `@dblimp/*`.

El núcleo del framework se basa en el motor de renderizado declarativo **Goat** (anteriormente `JsonRender`), el cual interpreta esquemas JSON para construir árboles de componentes interactivos de React, enlaces a enrutadores y controladores de estado.

---

## Paquetes en este Monorepo

| Paquete | Versión | Descripción |
| :--- | :--- | :--- |
| [`@dblimp/core`](packages/core/README.md) | `0.0.1` | Motor central Goat, componentes base, controladores, esquema de rutas y utilidades de configuración. |
| [`@dblimp/bs5`](packages/bs5/README.md) | `0.0.1` | Componentes visuales, contenedores, campos y navegación estilizados con Bootstrap 5. |
| [`@dblimp/chartjs`](packages/chartjs/README.md) | `0.0.1` | Componentes declarativos para gráficos basados en Chart.js (Line, Bar, Doughnut, Scatter). |
| [`@dblimp/dnd`](packages/dnd/README.md) | `0.0.1` | Contenedor de listas reordenables Drag and Drop con `react-beautiful-dnd`. |
| [`@dblimp/floating`](packages/floating/README.md) | `0.0.1` | Contenedores flotantes y menús desplegables con `@floating-ui/react`. |
| [`@dblimp/icomoon`](packages/icomoon/README.md) | `0.0.1` | Conjunto tipográfico e iconos vectoriales SVG con Icomoon. |
| [`@dblimp/konva`](packages/konva/README.md) | `0.0.1` | Integración con Konva y React-Konva para lienzo 2D y formas dinámicas. |
| [`@dblimp/react-pdf`](packages/react-pdf/README.md) | `0.0.1` | Generación de documentos PDF basados en esquemas con `@react-pdf/renderer`. |
| [`@dblimp/splide`](packages/splide/README.md) | `0.0.1` | Carruseles y sliders basados en Splide.js. |
| [`@dblimp/swiper`](packages/swiper/README.md) | `0.0.1` | Sliders y Hero banners basados en Swiper. |
| [`@dblimp/tabulator`](packages/tabulator/README.md) | `0.0.1` | Tablas de datos interactivas y avanzadas basadas en Tabulator. |
| [`@dblimp/youtube`](packages/youtube/README.md) | `0.0.1` | Reproductor interactivo de videos de YouTube con YouTube Player API. |

---

## Instalación y Desarrollo

### Prerrequisitos
- Node.js >= 18.0.0
- Yarn Classic (v1.22+)

### Instalación de dependencias
```bash
yarn install
```

### Compilar todos los paquetes
```bash
yarn build
```

También puedes compilar un paquete individualmente:
```bash
yarn build:core
yarn build:bs5
yarn workspace @dblimp/chartjs run build
```

### Ejecutar pruebas
```bash
yarn test
```

### Limpiar artefactos de compilación
```bash
yarn clean
```

---

## Flujo de Publicación (Release)

El proyecto incluye un script de automatización [`release.sh`](./release.sh) para versionar y publicar en NPM de forma individual únicamente los paquetes que sufrieron modificaciones:

```bash
# Asegúrate de trabajar en una rama de desarrollo (ej. dev o feature/*)
git checkout dev

# Ejecutar el script de liberación
./release.sh
```

El script detectará los paquetes modificados respecto a `master`, incrementará sus versiones, ejecutará los builds y los publicará en el registro público de NPM.

---

## Licencia

ISC
