import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          borderRadius: 7,
          color: "#ffffff",
          fontSize: 19,
          fontWeight: 800,
          letterSpacing: "-0.08em",
        }}
      >
        JR<span style={{ color: "#ff0000" }}>.</span>
      </div>
    ),
    size,
  );
}
