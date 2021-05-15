import React from "react";
import { scaleBand, format, max, scaleLinear } from "d3";
import { useData } from "./useData";
import { AxisBottom } from "./AxisBottom";
import { AxisLeft } from "./AxisLeft";
import { Marks } from "./Marks";
const width = 700;
const height = 400;
const margin = {
  top: 20,
  bottom: 100,
  left: 140,
  right: 20,
};

const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.right - margin.left;

function BarChart() {
  const data = useData();
  const yScale = scaleBand()
    .domain(data.map((d) => d.Country))
    .range([0, innerHeight])
    .padding(0.1);

  const xScale = scaleLinear()
    .domain([0, max(data, (d) => d.Population)])
    .range([0, innerWidth]);

  return (
    <div>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AxisBottom
            xScale={xScale}
            innerHeight={innerHeight}
            tickFormat={format(".2s")}
          />
          <AxisLeft yScale={yScale} />
          <text
            className="axis-label"
            x={innerWidth / 2}
            y={innerHeight + 30}
            textAnchor="center"
          >
            Population
          </text>
          <Marks data={data} xScale={xScale} yScale={yScale} />
        </g>
      </svg>
    </div>
  );
}

export default BarChart;
