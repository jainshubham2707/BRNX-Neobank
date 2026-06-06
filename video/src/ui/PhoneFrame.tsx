import React from "react";

/**
 * 390×844 phone screen on a black bezel — matches the live app's PhoneFrame
 * dimensions exactly. Children render inside the inner rounded rectangle.
 */
export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  notch?: boolean;
  scale?: number;
}> = ({ children, notch = true, scale = 1 }) => {
  const W = 390;
  const H = 844;
  return (
    <div
      style={{
        width: W,
        height: H,
        borderRadius: 52,
        backgroundColor: "#000",
        padding: 8,
        boxShadow:
          "0 60px 120px -20px rgba(0,0,0,0.7), 0 30px 60px -10px rgba(7,90,189,0.25)",
        transform: `scale(${scale})`,
        transformOrigin: "top center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 44,
          overflow: "hidden",
          backgroundColor: "#F8FAFC",
        }}
      >
        <div
          style={{ position: "absolute", inset: 0, overflow: "hidden" }}
        >
          {children}
        </div>
        {notch && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 44,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: 6,
              pointerEvents: "none",
              zIndex: 30,
            }}
          >
            <div
              style={{
                height: 28,
                width: 112,
                backgroundColor: "#000",
                borderRadius: 999,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
