import React from "react";

import { addComponents } from "@dblimp/core/components";

import PdfDocument from "./pdf-document";
import { PdfView, PdfText, PdfImage, PdfLink } from "./pdf-elements";

export { default as PdfDocument } from "./pdf-document";
export { PdfView, PdfText, PdfImage, PdfLink } from "./pdf-elements";
export type { PdfDocumentProps, PdfDocumentState } from "./pdf-document";
export type { PdfViewProps, PdfTextProps, PdfImageProps, PdfLinkProps } from "./pdf-elements";

const pdfComponents = {
  PdfDocument,
  PdfView,
  PdfText,
  PdfImage,
  PdfLink,
};

export const addPdfComponents = (
  components?: Record<string, React.FC | typeof React.Component>
) => {
  if (!components) return false;
  Object.assign(pdfComponents, components);
  addComponents(pdfComponents);
  return true;
};

export default pdfComponents;
