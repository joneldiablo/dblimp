# @dblimp/core

Núcleo del framework DBLimp. Proporciona el motor de renderizado declarativo **Goat**, la jerarquía de componentes base, controladores de vista, enrutamiento mediante esquemas y contenedores fundamentales.

## Instalación

```bash
npm install @dblimp/core
# o con yarn
yarn add @dblimp/core
```

### Dependencias de pares (Peer Dependencies)
- `react`: `^18.3.1 || ^19.0.0`
- `react-dom`: `^18.3.1 || ^19.0.0`
- `react-router-dom`: `^7.0.0`
- `dbl-utils`: `^1.0.12`

---

## Características Principales

1. **Goat Engine (`Goat`)**:
   Motor declarativo que transforma estructuras JSON / objetos JS en componentes React en tiempo de ejecución, gestionando referencias `$props`, resoluciones automáticas y mutaciones dinámicas.
2. **Jerarquía de Componentes Base**:
   - `Component`: Clase base para componentes con soporte para mutaciones y ciclo de vida de estilos.
   - `ComplexComponent`: Soporta esquemas anidados con slots y reglas de sustitución.
   - `ComplexResponsiveComponent`: Agrega detección de dimensiones y puntos de interrupción responsivos.
3. **Controladores**:
   - `Controller`: Componente desacoplado para coordinar estados y vistas hijo.
   - `TitleController`: Controlador con encabezado integrado.
   - `appCtrl`: Bus central de eventos y estado de la aplicación.
4. **Enrutamiento por Esquema**:
   - `Route`, `SchemaController`, `withRouteWrapper`: Generación de rutas React Router a partir de definiciones declarativas.
5. **Formularios y Campos Base**:
   - `Form`: Manejador de estado y validaciones de formularios.
   - Campos desacoplados: `AutocompleteField`, `CheckboxField`, `DateRangeField`, `Field`, `GroupField`, `HiddenField`, `JsonEditorField`, `NoWrapField`, `PaginationField`, `RadioField`, `SelectField`, `TextareaField`.
   - Grupos: `Group`, `CardGroup`, `GridGroup`.
6. **Contenedores Esenciales**:
   - `Container`, `DetailsContainer`, `FormContainer`, `GoatContainer`, `GridContainer`, `ListContainer`, `AutoResponsiveContainer`, `FullscreenContainer`, `ProportionalContainer`, `ScrollContainer`.
7. **Medios**:
   - `Image`, `Svg`, `SvgImports`, `Video`.

---

## Ejemplos de Uso

### 1. Renderizado declarativo con `Goat`

```tsx
import React from "react";
import { Goat, addComponents } from "@dblimp/core";

const schema = {
  name: "profile-card",
  component: "Container",
  classes: "profile-wrapper",
  content: [
    {
      name: "avatar",
      component: "Image",
      src: "https://example.com/avatar.jpg",
      alt: "User Avatar"
    },
    {
      name: "user-name",
      tag: "h2",
      content: "John Doe"
    }
  ]
};

export const Profile = () => {
  const goat = new Goat({ name: "profile" });
  return <div>{goat.buildContent(schema)}</div>;
};
```

### 2. Registrar componentes personalizados en el registro de Goat

```ts
import { addComponents } from "@dblimp/core";
import MyCustomWidget from "./MyCustomWidget";

addComponents({
  MyCustomWidget
});
```

### 3. Crear un controlador

```tsx
import React from "react";
import { Controller } from "@dblimp/core";

export default class DashboardController extends Controller {
  static jsClass = "DashboardController";

  content() {
    return (
      <div className="dashboard">
        <h1>Dashboard Central</h1>
        {super.content()}
      </div>
    );
  }
}
```

---

## Licencia

ISC
