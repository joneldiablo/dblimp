import React from "react";
import { View, Text, Image, Link } from "@react-pdf/renderer";

export interface PdfViewProps {
  style?: any;
  wrap?: boolean;
  fixed?: boolean;
  children?: React.ReactNode;
}

export const PdfView: React.FC<PdfViewProps> & { wrapper: false; dontBuildContent: true } = (props) => {
  const { children, ...rest } = props;
  return React.createElement(View, rest, children);
};

PdfView.wrapper = false;
PdfView.dontBuildContent = true;

export interface PdfTextProps {
  style?: any;
  wrap?: boolean;
  children?: React.ReactNode;
}

export const PdfText: React.FC<PdfTextProps> & { wrapper: false; dontBuildContent: true } = (props) => {
  const { children, ...rest } = props;
  return React.createElement(Text, rest, children);
};

PdfText.wrapper = false;
PdfText.dontBuildContent = true;

export interface PdfImageProps {
  style?: any;
  src?: string;
  cache?: boolean;
}

export const PdfImage: React.FC<PdfImageProps> & { wrapper: false; dontBuildContent: true } = (props) => {
  const { src, ...rest } = props;
  return React.createElement(Image, { src, ...rest });
};

PdfImage.wrapper = false;
PdfImage.dontBuildContent = true;

export interface PdfLinkProps {
  style?: any;
  src?: string;
  children?: React.ReactNode;
}

export const PdfLink: React.FC<PdfLinkProps> & { wrapper: false; dontBuildContent: true } = (props) => {
  const { children, ...rest } = props;
  return React.createElement(Link, rest, children);
};

PdfLink.wrapper = false;
PdfLink.dontBuildContent = true;
