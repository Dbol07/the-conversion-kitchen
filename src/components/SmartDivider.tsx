import { dividerMap, type DividerVariant } from "./Dividers";

export default function SmartDivider({
  variant = "default",
  className = "",
}: {
  variant?: DividerVariant;
  className?: string;
}) {
  return (
    <div className={`flex justify-center my-6 ${className}`}>
      <img
        src={dividerMap[variant]}
        alt={`${variant} divider`}
        className="h-6 opacity-90"
      />
    </div>
  );
}
