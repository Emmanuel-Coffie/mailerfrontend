import type { CSSProperties } from "react";
export function GreenHaulLogo({
  size = 32,
  className = "",
  style = {},
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <img
      src="/brand-logo.jpg"
      alt="GreenHaul Solutions"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        borderRadius: 7,
        ...style,
      }}
    />
  );
}
