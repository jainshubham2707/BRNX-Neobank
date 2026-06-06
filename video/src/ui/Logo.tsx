import React from "react";
import { Mark } from "./Mark";
import { sora } from "../fonts";

export const Logo: React.FC<{
  knockout?: boolean;
  size?: number;
}> = ({ knockout = false, size = 28 }) => {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <Mark size={size} knockout={knockout} />
      <span
        style={{
          fontFamily: sora,
          fontWeight: 800,
          fontSize: size * 0.78,
          letterSpacing: "-0.02em",
          color: knockout ? "#FFFFFF" : "#053F84",
          lineHeight: 1,
        }}
      >
        BRNX
      </span>
    </div>
  );
};
