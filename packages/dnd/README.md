# @dblimp/dnd

Contenedor interactivo de listas reordenables Drag and Drop (arrastrar y soltar) basado en **`react-beautiful-dnd`** para el framework DBLimp.

## Instalación

```bash
npm install @dblimp/dnd @dblimp/core react-beautiful-dnd
# o con yarn
yarn add @dblimp/dnd @dblimp/core react-beautiful-dnd
```

### Dependencias de pares (Peer Dependencies)
- `@dblimp/core`: `^1.0.0-dev`
- `react-beautiful-dnd`: `^13.1.1`
- `react`: `^18.3.1 || ^19.0.0`
- `react-dom`: `^18.3.1 || ^19.0.0`

---

## Componentes Disponibles

- **`DndListContainer`**: Contenedor que envuelve una colección de elementos ordenables, emitiendo eventos de reordenamiento (`onDragEnd`) y actualizando índices visualmente con animación fluida y accesibilidad por teclado.

---

## Ejemplo de Uso

```tsx
import React, { useState } from "react";
import DndListContainer from "@dblimp/dnd";

export const TaskList = () => {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Diseñar wireframes" },
    { id: "2", title: "Configurar monorepo" },
    { id: "3", title: "Publicar paquetes en npm" }
  ]);

  const handleOrderChange = (reorderedItems: any[]) => {
    setTasks(reorderedItems);
    console.log("Nuevo orden:", reorderedItems);
  };

  return (
    <DndListContainer
      name="tasksDnd"
      items={tasks}
      onOrderChange={handleOrderChange}
    >
      {tasks.map((task) => (
        <div key={task.id} className="p-3 border mb-2 bg-white rounded shadow-sm">
          {task.title}
        </div>
      ))}
    </DndListContainer>
  );
};
```

---

## Licencia

ISC
