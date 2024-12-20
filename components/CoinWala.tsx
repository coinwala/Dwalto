import React from "react";

const CoinwalaLogo = ({ width = "1000", height = "120", className = "" }) => {
  return (
    <div className={`${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 120"
        width={width}
        height={height}
        className="w-full h-auto"
      >
        <g
          fontFamily="Arial Black, sans-serif"
          fontWeight="900"
          fontSize="100"
          letterSpacing="0.1em"
        >
          <text x="40" y="90" fill="#333333" transform="translate(12, 12)">
            COINWALA
          </text>
          <text x="40" y="90" fill="#4d4d4d" transform="translate(9, 9)">
            COINWALA
          </text>
          <text x="40" y="90" fill="#666666" transform="translate(6, 6)">
            COINWALA
          </text>
          <text x="40" y="90" fill="#808080" transform="translate(3, 3)">
            COINWALA
          </text>

          {/* Main text */}
          <text x="40" y="90" fill="white">
            COINWALA
          </text>
        </g>
      </svg>
    </div>
  );
};
export default CoinwalaLogo;
