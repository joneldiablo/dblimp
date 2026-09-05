import React from "react";

interface InlineSvgProps {
  svg?: string;
  classes?: string | string[];
  style?: React.CSSProperties;
}

/** Renders a raw inline SVG string fetched from an asset. */
export default function InlineSvg({ svg, classes, style }: InlineSvgProps) {
  const cn = ["InlineSvg"];
  if (classes) cn.push(...(Array.isArray(classes) ? classes : [classes]));
  return (
    <span className={cn.filter(Boolean).join(" ")} style={style}>
      {svg ? <span dangerouslySetInnerHTML={{ __html: svg }} /> : null}
    </span>
  );
}