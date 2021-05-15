import React, { useEffect, useState } from "react";
import {
  csv,
  scaleLinear,
  scaleTime,
  extent,
  max,
  timeFormat,
  line,
  curveNatural,
  curveBasis,
} from "d3";

function LineChart() {
  const [data, setData] = useState([]);
  const csvUrl =
    "https://gist.githubusercontent.com/curran/90240a6d88bdb1411467b21ea0769029/raw/7d4c3914cc6a29a7f5165f7d5d82b735d97bcfe4/week_temperature_sf.csv";

  useEffect(() => {
    const row = (d) => {
      d.temperature = Number(d.temperature);
      d.timestamp = new Date(d.timestamp);
      return d;
    };
    csv(csvUrl, row).then((data) => {
      setData(data);
    });
  }, []);

  const width = 700;
  const height = 400;
  const xValue = (d) => d.timestamp;
  const yValue = (d) => d.temperature;
  const margin = { top: 20, right: 30, bottom: 65, left: 90 };

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;
  /**create the x-axis scale */
  const xScale = scaleTime()
    .domain(extent(data, (d) => d.timestamp))
    .range([0, innerWidth]);

  /**create the y-scale */
  const yScale = scaleLinear()
    .domain(extent(data, (d) => d.temperature))
    .range([innerHeight, 0]);
  return (
    <div>
      <svg width={width} height={height}>
        <g transform={`translate(60,10)`}>
          {/**create the bottom axis using scales */}
          <text style={{ textAnchor: "middle" }} x={width / 2} y={height - 20}>
            Time
          </text>
          {xScale.ticks().map((d) => (
            <g className="tick" transform={`translate(${xScale(d)},0)`} key={d}>
              <line y2={innerHeight} />
              <text
                style={{ textAnchor: "middle", fontSize: "12", color: "red" }}
                dy=".71em"
                y={height - 60}
              >
                {timeFormat("%a")(d)}
              </text>
            </g>
          ))}
          <text transform={`rotate(270)`} x={-height / 2} y={-40}>
            Temperature
          </text>
          {/**create the y axis */}
          {yScale.ticks().map((d) => (
            <g className="tick" transform={`translate(0,${yScale(d)})`} key={d}>
              <line x2={innerWidth} />
              <text style={{ textAnchor: "end" }} x={-5} dy=".32em">
                {d}
              </text>
            </g>
          ))}
          {/**draw line graph */}
          <g className="marks">
            <path
              fill="none"
              stroke="black"
              d={line()
                .x((d) => xScale(d.timestamp))
                .y((d) => yScale(d.temperature))
                .curve(curveBasis)(data)}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default LineChart;
