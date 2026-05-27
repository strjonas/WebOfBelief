import { ImageResponse } from "next/og";

export const alt =
  "Belief Mirror: source-backed reflection on which beliefs can stand together";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#faf8f3",
          color: "#1c1917",
          display: "flex",
          height: "100%",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "stretch",
            display: "flex",
            height: 494,
            margin: "68px 76px",
            width: 1048,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: 700,
            }}
          >
            <div
              style={{
                alignItems: "center",
                display: "flex",
                fontSize: 27,
                fontWeight: 600,
                gap: 18,
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  background: "#1c1917",
                  borderRadius: 18,
                  color: "#faf8f3",
                  display: "flex",
                  fontSize: 20,
                  height: 54,
                  justifyContent: "center",
                  letterSpacing: "-0.04em",
                  width: 54,
                }}
              >
                BM
              </div>
              Belief Mirror
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  color: "#0f766e",
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  marginBottom: 24,
                  textTransform: "uppercase",
                }}
              >
                Source-backed worldview reflection
              </div>
              <div
                style={{
                  fontSize: 62,
                  fontWeight: 650,
                  letterSpacing: "-0.055em",
                  lineHeight: 1.04,
                  maxWidth: 820,
                }}
              >
                Which of your beliefs can stand together?
              </div>
            </div>
            <div style={{ color: "#57534e", display: "flex", fontSize: 24 }}>
              Conflicts, live arguments, and coherent combinations - with
              sources.
            </div>
          </div>
          <div
            style={{
              alignItems: "center",
              border: "2px solid #d6d3d1",
              borderRadius: 34,
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              gap: 20,
              justifyContent: "center",
              marginLeft: 48,
              width: 250,
            }}
          >
            <div
              style={{
                color: "#0f766e",
                fontSize: 78,
                fontWeight: 650,
                lineHeight: 1,
              }}
            >
              19
            </div>
            <div
              style={{
                color: "#57534e",
                display: "flex",
                fontSize: 22,
                textAlign: "center",
                width: 170,
              }}
            >
              carefully framed statements
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
