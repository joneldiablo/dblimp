# @dblimp/icomoon

Sistema de iconografía vectorial SVG y tipográfica basado en **`react-icomoon`** con catálogo precargado para el framework DBLimp.

## Instalación

```bash
npm install @dblimp/icomoon react react-dom
# o con yarn
yarn add @dblimp/icomoon react react-dom
```

### Dependencias de pares (Peer Dependencies)
- `react`: `^18.3.1 || ^19.0.0`
- `react-dom`: `^18.3.1 || ^19.0.0`

---

## Características

- **Componente `Icons`**: Renderiza iconos vectoriales SVG limpios y responsivos a partir de nombres clave o glifos del iconset.
- **Icon Set por Defecto**: Incluye la tipografía y glifos `goatjs-default-icons` (v1.0) con iconos de interfaz (chevrons, flechas, acciones, redes, etc.).
- **Extensibilidad**: Permite registrar icon sets adicionales en tiempo de ejecución con `addIcons` o `setIconSet`.

---

## Ejemplo de Uso

### Uso directo del componente

```tsx
import React from "react";
import Icons, { addIcons } from "@dblimp/icomoon";

export const IconBar = () => (
  <div className="d-flex align-items-center gap-3">
    <Icons icon="home" size={24} color="#0d6efd" />
    <Icons icon="search" size={24} color="#6c757d" />
    <Icons icon="cog" size={24} color="#198754" />
  </div>
);
```

### Registrar un set de iconos personalizado (Icomoon JSON)

```ts
import { setIconSet } from "@dblimp/icomoon";
import customSelection from "./selection.json";

setIconSet(customSelection);
```

---

## Licencia

ISC
