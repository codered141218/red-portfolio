import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/app/components/portfolio/data";

export const alt = `${profile.fullName}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontPath = join(
  process.cwd(),
  "node_modules/@fontsource/open-sans/files/open-sans-latin-800-normal.woff",
);

export default async function OpenGraphImage() {
  const openSansExtraBold = await readFile(fontPath);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#050505",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          color: "#f7f7f7",
          fontFamily: "Open Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            color: "#d2d2d2",
          }}
        >
          <div style={{ width: 6, height: 34, background: "#ff0000" }} />
          {profile.role}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 168,
              lineHeight: 0.9,
              letterSpacing: "-0.07em",
            }}
          >
            {profile.firstName} {profile.lastName}
            <span style={{ color: "#ff0000" }}>.</span>
          </div>
          <div
            style={{
              marginTop: 36,
              maxWidth: 900,
              fontSize: 30,
              lineHeight: 1.4,
              color: "#bdbdbd",
            }}
          >
            {profile.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#8a8a8a",
          }}
        >
          <span>{profile.email}</span>
          <span>8+ years · Operations · Systems · Digital support</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Open Sans",
          data: openSansExtraBold,
          style: "normal",
          weight: 800,
        },
      ],
    },
  );
}
