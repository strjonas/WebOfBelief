import { ImageResponse } from "next/og";

export const alt =
  "Web of Belief: source-backed reflection on which beliefs can stand together";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const nodes: Array<[number, number]> = [
  [50, 50],
  [120, 30],
  [200, 60],
  [270, 90],
  [80, 110],
  [160, 130],
  [240, 160],
  [40, 200],
  [130, 220],
  [220, 230],
  [285, 250],
  [90, 280],
  [180, 290],
];

const edges: Array<[number, number, number, number]> = [
  [50, 50, 120, 30],
  [120, 30, 200, 60],
  [200, 60, 270, 90],
  [50, 50, 80, 110],
  [80, 110, 160, 130],
  [200, 60, 160, 130],
  [160, 130, 240, 160],
  [80, 110, 40, 200],
  [40, 200, 130, 220],
  [130, 220, 220, 230],
  [220, 230, 285, 250],
  [130, 220, 180, 290],
  [90, 280, 180, 290],
  [40, 200, 90, 280],
  [160, 130, 130, 220],
];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ece9e0",
          color: "#11131a",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: 60,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            border: "1px solid #b1ad9f",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "44px 56px",
          }}
        >
          {/* Masthead */}
          <div
            style={{
              alignItems: "baseline",
              borderBottom: "1px solid #b1ad9f",
              display: "flex",
              gap: 22,
              paddingBottom: 18,
            }}
          >
            <div
              style={{
                color: "#7a1f1d",
                display: "flex",
                fontFamily: "monospace",
                fontSize: 22,
                letterSpacing: "0.22em",
              }}
            >
              VOL. I
            </div>
            <div style={{ display: "flex", fontSize: 32, fontWeight: 500 }}>
              Web of Belief
            </div>
            <div
              style={{
                color: "#545860",
                display: "flex",
                fontFamily: "monospace",
                fontSize: 18,
                letterSpacing: "0.18em",
                marginLeft: "auto",
                textTransform: "uppercase",
              }}
            >
              A CONSISTENCY CHECK
            </div>
          </div>

          {/* Body row */}
          <div
            style={{
              display: "flex",
              flex: 1,
              gap: 40,
              paddingTop: 36,
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
                  display: "flex",
                  flexDirection: "column",
                  fontSize: 60,
                  fontWeight: 500,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.06,
                }}
              >
                <div style={{ display: "flex" }}>
                  Your beliefs form a web.
                </div>
                <div style={{ color: "#545860", display: "flex" }}>
                  Find out where it tears.
                </div>
              </div>
              <div
                style={{
                  color: "#545860",
                  display: "flex",
                  fontSize: 22,
                  lineHeight: 1.4,
                  marginTop: 24,
                  maxWidth: 620,
                }}
              >
                Direct conflicts, conditional implications, live arguments, and
                coherent combinations — every finding cites philosophical
                sources.
              </div>
            </div>

            <div
              style={{
                alignItems: "center",
                borderLeft: "1px solid #b1ad9f",
                display: "flex",
                flex: 1,
                justifyContent: "center",
                paddingLeft: 36,
              }}
            >
              <svg
                width="320"
                height="320"
                viewBox="0 0 320 320"
                xmlns="http://www.w3.org/2000/svg"
              >
                {edges.map(([x1, y1, x2, y2], idx) => (
                  <line
                    key={`e-${idx}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={idx % 5 === 0 ? "#7a1f1d" : "#11131a"}
                    strokeWidth={idx % 5 === 0 ? 1.6 : 1}
                    opacity={idx % 5 === 0 ? 0.85 : 0.45}
                  />
                ))}
                {nodes.map(([x, y], idx) => (
                  <circle
                    key={`n-${idx}`}
                    cx={x}
                    cy={y}
                    r="5"
                    fill={idx % 4 === 0 ? "#7a1f1d" : "#ece9e0"}
                    stroke={idx % 4 === 0 ? "#7a1f1d" : "#11131a"}
                    strokeWidth="1.5"
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              borderTop: "1px solid #b1ad9f",
              color: "#545860",
              display: "flex",
              fontFamily: "monospace",
              fontSize: 18,
              justifyContent: "space-between",
              letterSpacing: "0.18em",
              marginTop: 28,
              paddingTop: 14,
              textTransform: "uppercase",
            }}
          >
            <div style={{ display: "flex" }}>
              18 questions &middot; ~5 minutes
            </div>
            <div style={{ color: "#7a1f1d", display: "flex" }}>
              webofbelief.app
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
