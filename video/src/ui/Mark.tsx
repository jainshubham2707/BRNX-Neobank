import React from "react";

/** Four-blade pinwheel mark — exact copy of the live app's Mark. */
export const Mark: React.FC<{
  size?: number;
  knockout?: boolean;
  twoTone?: boolean;
  style?: React.CSSProperties;
}> = ({ size = 28, knockout = false, twoTone = true, style }) => {
  const a = knockout ? "#FFFFFF" : "#075ABD";
  const b = knockout ? "#FFFFFF" : twoTone ? "#054086" : "#075ABD";
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden
      style={style}
    >
      <path d="M50 50 L50 8 Q66 12 66 34 Q66 50 50 50Z" fill={a} />
      <path d="M50 50 L92 50 Q88 66 66 66 Q50 66 50 50Z" fill={b} />
      <path d="M50 50 L50 92 Q34 88 34 66 Q34 50 50 50Z" fill={a} />
      <path d="M50 50 L8 50 Q12 34 34 34 Q50 34 50 50Z" fill={b} />
    </svg>
  );
};
