# @dblimp/konva

Integración de lienzo 2D interactivo con **`Konva`** y **`react-konva`**, permitiendo renderizar gráficos, formas vectoriales y figuras geométricas declarativamente mediante esquemas JSON en el framework DBLimp.

## Instalación

```bash
npm install @dblimp/konva @dblimp/core konva react-konva
# o con yarn
yarn add @dblimp/konva @dblimp/core konva react-konva
```

### Dependencias de pares (Peer Dependencies)
- `@dblimp/core`: `^1.0.0-dev`
- `konva`: `^9.3.0`
- `react-konva`: `^18.2.10`
- `react`: `^18.3.1 || ^19.0.0`
- `react-dom`: `^18.3.1 || ^19.0.0`

---

## Componentes Disponibles

- **Componentes Konva Declarativos**: Exporta adaptadores para los nodos principales de `react-konva` (`StageKonva`, `LayerKonva`, `RectKonva`, `CircleKonva`, `LineKonva`, etc.) habilitados para consumo dentro de los esquemas del motor Goat.
- **`Trapezoid`**: Componente de figura geométrica con formulario de ajuste paramétrico (base mayor, base menor, altura) y renderizado en tiempo real sobre canvas.

---

## Ejemplo de Uso

```tsx
import React from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";

export const CanvasScene = () => (
  <Stage width={400} height={300}>
    <Layer>
      <Rect
        x={20}
        y={20}
        width={100}
        height={50}
        fill="#0d6efd"
        shadowBlur={5}
      />
      <Circle x={200} y={100} radius={40} fill="#198754" />
    </Layer>
  </Stage>
);
```

---

## Licencia

ISC
