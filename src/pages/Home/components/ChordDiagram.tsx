import React from 'react';

export interface ChordDiagramProps {
  name: string;
  fingering: number[]; // 6 numbers: 6th string -> 1st string. -1=x, 0=open, >0=fret
  width?: number;
  height?: number;
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({
  name,
  fingering,
  width = 60,
  height = 80,
}) => {
  // Config
  const numStrings = 6;
  const numFrets = 5;
  const paddingX = 10;
  const paddingY = 20;

  const w = width - paddingX * 2;
  const h = height - paddingY * 2;

  const stringSpacing = w / (numStrings - 1);
  const fretSpacing = h / numFrets;

  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-bold mb-1">{name}</span>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${paddingX}, ${paddingY})`}>
          {/* Frets */}
          {Array.from({ length: numFrets + 1 }).map((_, i) => (
            <line
              key={`fret-${i}`}
              x1={0}
              y1={i * fretSpacing}
              x2={w}
              y2={i * fretSpacing}
              stroke="#000"
              strokeWidth={i === 0 ? 2 : 1} // Bold nut
            />
          ))}

          {/* Strings */}
          {Array.from({ length: numStrings }).map((_, i) => (
            <line
              key={`string-${i}`}
              x1={i * stringSpacing}
              y1={0}
              x2={i * stringSpacing}
              y2={h}
              stroke="#000"
              strokeWidth={1}
            />
          ))}

          {/* Fingerings */}
          {fingering.map((fret, stringIndex) => {
            // String index 0 is 6th string (Low E), which is left-most
            const x = stringIndex * stringSpacing;

            if (fret === -1) {
              // Mute (X)
              return (
                <text
                  key={`mute-${stringIndex}`}
                  x={x}
                  y={-5}
                  fontSize={10}
                  textAnchor="middle"
                  fill="#000"
                >
                  X
                </text>
              );
            } else if (fret === 0) {
              // Open (O)
              return (
                <text
                  key={`open-${stringIndex}`}
                  x={x}
                  y={-5}
                  fontSize={10}
                  textAnchor="middle"
                  fill="#000"
                >
                  O
                </text>
              );
            } else {
              // Fret position (Circle)
              // y is centered in the fret space
              const y = (fret - 1) * fretSpacing + fretSpacing / 2;
              return (
                <circle
                  key={`finger-${stringIndex}`}
                  cx={x}
                  cy={y}
                  r={Math.min(stringSpacing, fretSpacing) * 0.35}
                  fill="#000"
                />
              );
            }
          })}
        </g>
      </svg>
    </div>
  );
};

export default ChordDiagram;
