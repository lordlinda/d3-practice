import React, { useState, useEffect } from "react";
import {
  timeFormat,
  scaleLinear,
  sum,
  csv,
  bin,
  extent,
  scaleTime,
  timeMonths,
} from "d3";
import { AxisBottom } from "./AxisBottom";

function Migrants() {
  const csvUrl =
    "https://gist.githubusercontent.com/curran/a9656d711a8ad31d812b8f9963ac441c/raw/267eac8b97d161c479d950ffad3ddd5ce2d1f370/MissingMigrants-Global-2019-10-08T09-47-14-subset.csv";
  const [data, setData] = useState([]);
  useEffect(() => {
    const row = (d) => {
      d["Total Dead and Missing"] = +d["Total Dead and Missing"];
      d["Reported Date"] = new Date(d["Reported Date"]);
      return d;
    };
    csv(csvUrl, row).then(setData);
  }, []);

  const width = 960,
    height = 500,
    margin = { top: 20, right: 20, bottom: 30, left: 70 },
    innerHeight = height - margin.top - margin.bottom,
    innerWidth = width - margin.left - margin.right,
    x = scaleTime()
      .domain(extent(data, (d) => d["Reported Date"]))
      .range([0, width - margin.left - margin.right])
      .nice(),
    [start, stop] = x.domain(),
    binnedData = bin()
      .value((d) => d["Reported Date"])
      .domain(x.domain())
      .thresholds(timeMonths(start, stop))(data)
      .map((array) => ({
        y: sum(array, (d) => d["Total Dead and Missing"]),
        x0: array.x0,
        x1: array.x1,
      })),
    y = scaleLinear()
      .domain(extent(binnedData, (d) => d.y))
      .range([innerHeight, 0]),
    xAxisLabelOffset = 30,
    xAxisLabel = "Time",
    yAxisLabel = "Total Dead and Missing",
    xAxisTickFormat = timeFormat("%m/%d/%Y"),
    yAxisLabelOffset = 35;

  return (
    <div>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AxisBottom
            xScale={x}
            innerHeight={innerHeight}
            tickFormat={xAxisTickFormat}
            tickOffset={8}
          />
          <text
            className="axis-label"
            textAnchor="middle"
            transform={`translate(${-yAxisLabelOffset},${
              innerHeight / 2
            }) rotate(-90)`}
          >
            {yAxisLabel}
          </text>
          {y.ticks().map((tickValue) => (
            <g
              className="tick"
              key={tickValue}
              transform={`translate(0,${y(tickValue)})`}
            >
              <text
                style={{ textAnchor: "end", fontSize: "12" }}
                dy=".32em"
                x={-6}
              >
                {tickValue}
              </text>
            </g>
          ))}
          <text
            className="axis-label"
            x={innerWidth / 2}
            y={innerHeight + xAxisLabelOffset}
            textAnchor="middle"
          >
            {xAxisLabel}
          </text>
          {binnedData?.map((d, i) => (
            <rect
              key={i}
              className="mark"
              x={x(d.x0)}
              y={y(d.y)}
              width={x(d.x1) - x(d.x0)}
              height={innerHeight - y(d.y)}
            >
              <title>{d.y}</title>
            </rect>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default Migrants;
