# @dblimp/tabulator

Integración con **`Tabulator`** (`tabulator-tables`) para tablas interactivas con procesamiento de datos a gran escala, filtrado en vivo, paginación remota y edición en celda para DBLimp.

## Instalación

```bash
npm install @dblimp/tabulator @dblimp/core tabulator-tables
# o con yarn
yarn add @dblimp/tabulator @dblimp/core tabulator-tables
```

### Dependencias de pares (Peer Dependencies)
- `@dblimp/core`: `^1.0.0-dev`
- `tabulator-tables`: `^6.3.0`
- `react`: `^18.3.1 || ^19.0.0`
- `react-dom`: `^18.3.1 || ^19.0.0`

---

## Características

- **Tabulator Declarativo**: Capa de abstracción React sobre Tabulator Tables para consumir configuraciones de columnas, filtros y datasets desde esquemas JSON.
- **Rendimiento Alto**: Virtualización de DOM para renderizar miles de registros de forma fluida.
- **Soporte para Temas**: Compatible con hojas de estilo Tabulator estándar y Bootstrap 5.

---

## Ejemplo de Uso

```tsx
import React, { useEffect, useRef } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_bootstrap5.min.css";

export const CustomerGrid = () => {
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tableRef.current) return;

    const table = new Tabulator(tableRef.current, {
      data: [
        { id: 1, name: "María Gómez", role: "Developer", progress: 95 },
        { id: 2, name: "Roberto Díaz", role: "Designer", progress: 80 }
      ],
      layout: "fitColumns",
      columns: [
        { title: "ID", field: "id", width: 70 },
        { title: "Nombre", field: "name", sorter: "string" },
        { title: "Rol", field: "role" },
        { title: "Progreso", field: "progress", formatter: "progress" }
      ]
    });

    return () => {
      table.destroy();
    };
  }, []);

  return <div ref={tableRef} className="shadow-sm border rounded" />;
};
```

---

## Licencia

ISC
