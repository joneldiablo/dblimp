# @dblimp/react-pdf

Generación declarativa de documentos PDF basada en **`@react-pdf/renderer`** integrada con esquemas del ecosistema DBLimp.

## Instalación

```bash
npm install @dblimp/react-pdf @dblimp/core @react-pdf/renderer
# o con yarn
yarn add @dblimp/react-pdf @dblimp/core @react-pdf/renderer
```

### Dependencias de pares (Peer Dependencies)
- `@dblimp/core`: `^1.0.0-dev`
- `@react-pdf/renderer`: `^4.0.0`
- `react`: `^18.3.1 || ^19.0.0`
- `react-dom`: `^18.3.1 || ^19.0.0`

---

## Características

- **`PdfDocument`**: Contenedor principal que orquesta la compilación y visor/descarga de un archivo PDF estructurado a partir de un esquema de vistas.
- **Elementos PDF Declarativos**: Wrappers de `Document`, `Page`, `View`, `Text`, `Image`, `Link`, `Svg`, `Line`, `Rect` listos para ser instanciados de manera estándar o procesados por esquemas JSON.

---

## Ejemplo de Uso

```tsx
import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { PdfDocument } from "@dblimp/react-pdf";

const invoiceSchema = {
  name: "invoiceDocument",
  pages: [
    {
      size: "A4",
      style: { padding: 30 },
      content: [
        {
          tag: "Text",
          style: { fontSize: 24, marginBottom: 10, fontWeight: "bold" },
          content: "Factura de Servicios"
        },
        {
          tag: "Text",
          style: { fontSize: 12, color: "#555" },
          content: "Cliente: Empresa Ejemplo S.A. de C.V."
        }
      ]
    }
  ]
};

export const InvoicePreview = () => (
  <PDFViewer width="100%" height={600}>
    <PdfDocument schema={invoiceSchema} />
  </PDFViewer>
);
```

---

## Licencia

ISC
