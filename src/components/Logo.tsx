import greenhaulLogo from "../assets/images/greenhaul_logo_1790701516483.jpg";

export function GreenHaulLogo({
  size = 32,
  className = "",
  style = {},
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <img
      src={greenhaulLogo}
      alt="GreenHaul Solutions"
      className={className}
      onError={(e) => {
        // Guaranteed production fallback to public folder
        const target = e.currentTarget as HTMLImageElement;
        if (!target.src.endsWith("/greenhaul_logo.jpg")) {
          target.src = "/greenhaul_logo.jpg";
        }
      }}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
        display: "block",
        ...style,
      }}
    />
  );
}
