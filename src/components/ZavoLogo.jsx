import React from "react";

export default function ZavoLogo({ size = 28, showWordmark = true, color = "var(--zavo-green)", textColor = "var(--text-primary)" }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", userSelect: "none" }}>
      {/* Zavo Geometric Symbol: Modern minimalist Z wallet node */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect width="32" height="32" rx="9" fill={color} />
        {/* Crisp White Stylized Z Flow */}
        <path
          d="M8.5 10.5H23.5L12 21.5H23.5"
          stroke="#ffffff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Subtle accent dot indicating digital wallet sync */}
        <circle cx="21" cy="10.5" r="1.75" fill="#ffffff" />
      </svg>

      {showWordmark && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span
            style={{
              fontSize: size * 0.72,
              fontWeight: "800",
              color: textColor,
              letterSpacing: "-0.03em",
              fontFamily: "var(--font-main)"
            }}
          >
            zavo
          </span>
        </div>
      )}
    </div>
  );
}
