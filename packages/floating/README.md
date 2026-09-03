# @dblimp/floating

Contenedores flotantes, menús emergentes y tooltips basados en **`@floating-ui/react`** para posicionamiento dinámico y accesible en el ecosistema DBLimp.

## Instalación

```bash
npm install @dblimp/floating @dblimp/core @floating-ui/react
# o con yarn
yarn add @dblimp/floating @dblimp/core @floating-ui/react
```

### Dependencias de pares (Peer Dependencies)
- `@dblimp/core`: `^1.0.0-dev`
- `@floating-ui/react`: `^0.26.0`
- `react`: `^18.3.1 || ^19.0.0`
- `react-dom`: `^18.3.1 || ^19.0.0`

---

## Componentes Disponibles

- **`FloatingContainer`**: Contenedor flotante que se ancla a un elemento disparador (trigger) calculando desplazamientos, colisiones con los bordes de la ventana (flip/shift) y flechas de orientación.

---

## Ejemplo de Uso

```tsx
import React, { useState } from "react";
import FloatingContainer from "@dblimp/floating";

export const PopoverExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-5">
      <FloatingContainer
        name="popoverDemo"
        open={isOpen}
        placement="bottom-start"
        trigger={
          <button
            className="btn btn-outline-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            Abrir Menú
          </button>
        }
      >
        <div className="bg-white p-3 border rounded shadow-lg">
          <h6>Opciones flotantes</h6>
          <p className="small mb-0">Contenido posicionado automáticamente con Floating UI.</p>
        </div>
      </FloatingContainer>
    </div>
  );
};
```

---

## Licencia

ISC
