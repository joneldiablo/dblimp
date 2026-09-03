# @dblimp/splide

Contenedor de carruseles, sliders y galerías deslizantes basado en **`@splidejs/react-splide`** para DBLimp.

## Instalación

```bash
npm install @dblimp/splide @dblimp/core @splidejs/react-splide @splidejs/splide
# o con yarn
yarn add @dblimp/splide @dblimp/core @splidejs/react-splide @splidejs/splide
```

### Dependencias de pares (Peer Dependencies)
- `@dblimp/core`: `^1.0.0-dev`
- `@splidejs/react-splide`: `^0.7.12`
- `@splidejs/splide`: `^4.1.4`
- `react`: `^18.3.1 || ^19.0.0`
- `react-dom`: `^18.3.1 || ^19.0.0`

---

## Componentes Disponibles

- **`SlideContainer`**: Componente contenedor que transforma sus hijos directos o su contenido en diapositivas Splide con paginación, flechas, autoplay, soporte táctil responsivo y sincronización de miniaturas.

---

## Ejemplo de Uso

```tsx
import React from "react";
import SlideContainer from "@dblimp/splide";
import "@splidejs/splide/css";

export const HeroSlider = () => (
  <SlideContainer
    name="homeSlider"
    options={{
      type: "loop",
      autoplay: true,
      interval: 4000,
      pauseOnHover: true,
      perPage: 1,
      arrows: true,
      pagination: true
    }}
  >
    <div className="p-5 bg-primary text-white text-center rounded">
      <h1>Bienvenido a Nuestra Plataforma</h1>
      <p>Descubre soluciones escalables construidas con DBLimp.</p>
    </div>
    <div className="p-5 bg-dark text-white text-center rounded">
      <h1>Interfaces Guiadas por JSON</h1>
      <p>Crea layouts completos configurando simples esquemas.</p>
    </div>
  </SlideContainer>
);
```

---

## Licencia

ISC
