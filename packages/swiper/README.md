# @dblimp/swiper

Integración moderna con **`Swiper`** para carruseles avanzados, sliders táctiles de pantalla completa y componentes Hero en el ecosistema DBLimp.

## Instalación

```bash
npm install @dblimp/swiper @dblimp/core swiper
# o con yarn
yarn add @dblimp/swiper @dblimp/core swiper
```

### Dependencias de pares (Peer Dependencies)
- `@dblimp/core`: `^1.0.0-dev`
- `swiper`: `^11.0.0`
- `react`: `^18.3.1 || ^19.0.0`
- `react-dom`: `^18.3.1 || ^19.0.0`

---

## Componentes Disponibles

- **`HeroContainer`**: Contenedor principal para sliders Hero de ancho completo o fluidos, con soporte para autoplay, eventos táctiles y configuración modular de Swiper (`Autoplay`, `Navigation`, `Pagination`).
- **`Hero`**: Componente de diapositiva o contenedor de altura completa (`100vh`) diseñado para encabezados de alto impacto visual.

---

## Ejemplo de Uso

```tsx
import React from "react";
import { HeroContainer, Hero } from "@dblimp/swiper";
import "swiper/css";

export const HomeBanner = () => (
  <HeroContainer
    name="heroSwiper"
    autoplayDelay={5000}
    fullWidth
  >
    <Hero>
      <div className="d-flex align-items-center justify-content-center h-100 bg-secondary text-white">
        <h1>Transformando el Desarrollo Frontend</h1>
      </div>
    </Hero>
    <Hero>
      <div className="d-flex align-items-center justify-content-center h-100 bg-info text-white">
        <h1>Monorepos Modulares y Eficientes</h1>
      </div>
    </Hero>
  </HeroContainer>
);
```

---

## Licencia

ISC
