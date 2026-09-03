# @dblimp/cms

CMS JSON-template components for [imp-ts](https://github.com/joneldiablo/dblimp),
the TypeScript port of `dbl-components`.

## Installation

```bash
yarn add @dblimp/cms
```

## Usage

Import the components and register them into the Goat component registry once
(e.g. in your app entry) so JSON templates resolve by name:

```ts
import { registerCmsComponents } from "@dblimp/cms";

registerCmsComponents();
```

### Components

- `ArticlesList`
- `BlogPost`
- `CalendarField`
- `CardNavigation`
- `CardPanelNavigation`
- `CardPlans`
- `CardService`
- `CmsTemplate`
- `EndpointLoader`
- `HeaderBlog`
- `Image` (higher-order component that resolves `/assets` URLs)
- `Notifications`
- `OpeningHours`

### Utilities

- `utils/assets` — `resolveSrc`, `deleteUrl`, etc.
- `utils/find-scrollable-parent`

## Notes

Runtime template names such as `FloatingContainer` are resolved via the Goat
registry at runtime; make sure any referenced container is registered by your
app (e.g. from `@dblimp/bs5`).