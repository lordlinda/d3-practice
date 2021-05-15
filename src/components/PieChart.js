import { csv, arc, pie, scaleOrdinal } from "d3";

import React, { useEffect, useState } from "react";

function PieChart() {
  const csvUrl =
    "https://gist.githubusercontent.com/curran/b236990081a24761f7000567094914e0/raw/cssNamedColors.csv";

  const width = 300;
  const height = 200;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;
  const colors = ["#4daf4a", "#377eb8", "#ff7f00", "#984ea3", "#e41a1c"];

  const pieArc = arc().innerRadius(0).outerRadius(radius);
  const data = [2, 4, 8, 9];

  return (
    <div>
      <svg width={width} height={height}>
        <g transform={`translate(${centerX},${centerY})`}>
          {pie()(data).map((d, i) => (
            <path fill={colors[i]} d={pieArc(d)} />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default PieChart;
