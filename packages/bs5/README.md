# @dblimp/bs5

Colección de componentes visuales, contenedores, campos de formulario y navegación basados en **Bootstrap 5** para el ecosistema DBLimp.

## Instalación

```bash
npm install @dblimp/bs5 @dblimp/core bootstrap
# o con yarn
yarn add @dblimp/bs5 @dblimp/core bootstrap
```

### Dependencias de pares (Peer Dependencies)
- `@dblimp/core`: `^1.0.0-dev`
- `@dblimp/icomoon`: `^1.0.0-dev`
- `@dblimp/floating`: `^1.0.0-dev`
- `bootstrap`: `^5.3.3`
- `react`: `^18.3.1 || ^19.0.0`
- `react-dom`: `^18.3.1 || ^19.0.0`

---

## Componentes Disponibles

### 1. Acciones y Tablas
- **`Action`**: Botón o hipervínculo multipropósito con soporte para confirmaciones, ejecución de eventos `appCtrl`, modales y tooltips.
- **`Table`**: Componente de tabla dinámico con ordenamiento por columnas, filtrado por cabecera, estilos rayados/hover, celdas mutables y renderizado declarativo.

### 2. Contenedores Bootstrap 5
- `AlertContainer`: Alertas desmontables o fijas con esquema declarativo.
- `CardContainer`: Tarjetas Bootstrap (`card`, `card-body`, `card-header`, `card-footer`).
- `DropdownButtonContainer`: Botones desplegables con soporte para menús contextuales.
- `FooterContainer`: Pie de página responsivo.
- `GridContainer`: Contenedor estructurado en filas (`row`) y columnas (`col-*`).
- `ModalContainer` & `ModalButtonContainer`: Modales Bootstrap 5 con soporte para diálogos, backdrop y eventos.
- `OffcanvasContainer`: Paneles deslizantes laterales (Offcanvas).
- `PanelContainer`: Paneles colapsables y complejos con soporte de cabecera y cuerpo.
- `TabsContainer`: Pestañas de navegación Bootstrap con paneles de contenido conmutables.

### 3. Navegación
- `Navbar`: Barra de navegación responsive con soporte para menús izquierdo/derecho, branding y toggler colapsable.
- `Navigation`: Componente base de navegación arbórea y menús anidados.
- `SideNavigation`: Barra de navegación lateral fija o plegable.
- `HeaderNavigation`: Encabezados de página con enlaces y acciones integradas.
- `BrandNavigation`: Logotipo y enlace de marca institucional.
- `CardNavigation` & `CardPanelNavigation`: Cuadrículas de tarjetas navegables con iconos y enlaces.
- `CardsNavigation` & `CardListNavigation`: Vistas de navegación conmutables en tarjetas o lista.

### 4. Campos de Formulario (`fields`)
Campos diseñados para Bootstrap 5 con validaciones, clases de estado (`is-valid`, `is-invalid`), etiquetas flotantes y adornos:
- `Field`, `SelectField`, `CheckboxField`, `RadioField`, `SwitchField`, `TextareaField`.
- `DateRangeField`, `AutocompleteField`, `DropFileField`, `FileButtonField`, `FileField`.
- `JsonEditorField`, `NewPasswordField`, `NoWrapField`, `PaginationField`, `RangeField`, `HiddenField`.

---

## Ejemplos de Uso

### Uso de `Table`

```tsx
import React from "react";
import { Table } from "@dblimp/bs5";

const columns = [
  { name: "id", label: "#", orderable: true },
  { name: "name", label: "Nombre", orderable: true },
  { name: "email", label: "Correo Electrónico" },
  { name: "status", label: "Estado" }
];

const data = [
  { id: 1, name: "Ana Torres", email: "ana@example.com", status: "Activo" },
  { id: 2, name: "Carlos Luna", email: "carlos@example.com", status: "Inactivo" }
];

export const UsersTable = () => (
  <Table
    name="usersTable"
    columns={columns}
    data={data}
    striped
    hover
    tableClasses="table-bordered shadow-sm"
  />
);
```

### Uso de `Action`

```tsx
import React from "react";
import { Action } from "@dblimp/bs5";

export const ActionButtons = () => (
  <div className="d-flex gap-2">
    <Action
      name="saveBtn"
      label="Guardar Cambios"
      btnClasses="btn-primary"
      onClick={() => console.log("Guardando...")}
    />
    <Action
      name="deleteBtn"
      label="Eliminar"
      btnClasses="btn-danger"
      confirm="¿Estás seguro de que deseas eliminar este registro?"
      onClick={() => console.log("Eliminado")}
    />
  </div>
);
```

---

## Licencia

ISC
