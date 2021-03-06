import React, { useState, useEffect } from "react";
import { csv, scaleLinear, extent, scaleOrdinal } from "d3";
import { Dropdown } from "./Dropdown";
function ScatterPlot() {
  const width = 960;
  const height = 500 - 75;
  const margin = {
    top: 20,
    bottom: 75,
    left: 90,
    right: 100,
  };
  const [data, setData] = useState([]);
  const [hoveredValue, setHoveredValue] = useState("");

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.right - margin.left;
  const csvUrl =
    "https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/639388c2cbc2120a14dcf466e85730eb8be498bb/iris.csv";

  useEffect(() => {
    const row = (d) => {
      d.sepal_length = +d.sepal_length;
      d.sepal_width = +d.sepal_width;
      d.petal_length = +d.petal_length;
      d.petal_width = +d.petal_width;
      return d;
    };
    csv(csvUrl, row).then(setData);
  }, []);

  const [xAttribute, setXAttribute] = useState("petal_length");
  const [yAttribute, setYAttribute] = useState("sepal_width");

  const xScale = scaleLinear()
    .domain(extent(data, (d) => d[xAttribute]))
    .range([0, innerWidth])
    .nice();

  /**create the y-scale */
  const yScale = scaleLinear()
    .domain(extent(data, (d) => d[yAttribute]))
    .range([0, innerHeight]);

  /**color scale */
  const colorScale = scaleOrdinal()
    .domain(data.map((d) => d.species))
    .range(["#E6842A", "#137B80", "#8E6C8A"]);

  const attributes = [
    { value: "sepal_length", label: "Sepal Length" },
    { value: "sepal_width", label: "Sepal Width" },
    { value: "petal_length", label: "Petal Length" },
    { value: "petal_width", label: "Petal Width" },
    { value: "species", label: "Species" },
  ];
  const xValue = (d) => d[xAttribute];
  const yValue = (d) => d[yAttribute];
  const colorValue = (d) => d.species;

  const filteredData = data.filter((d) => d.species === hoveredValue);

  return (
    <div>
      {" "}
      <label htmlFor="x-select">X:</label>
      <Dropdown
        options={attributes}
        id="x-select"
        selectedValue={xAttribute}
        onSelectedValueChange={setXAttribute}
      />{" "}
      <label htmlFor="y-select">Y:</label>
      <Dropdown
        options={attributes}
        id="y-select"
        selectedValue={yAttribute}
        onSelectedValueChange={setYAttribute}
      />
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/**color legend */}
          <g transform={`translate(${innerWidth},50)`}>
            <text className="axis-label" y={-7}>
              Species
            </text>
            {colorScale.domain().map((domainValue, i) => (
              <g
                key={i}
                transform={`translate(0,${i * 20})`}
                onMouseEnter={() => setHoveredValue(domainValue)}
                onMouseLeave={() => setHoveredValue("")}
              >
                <circle fill={colorScale(domainValue)} r={7}></circle>
                <text x={15} dy=".32em">
                  {domainValue}
                </text>
              </g>
            ))}
          </g>
          {/**yscale axis and label */}
          {/**yscale label */}
          <text
            transform={`rotate(270)`}
            x={-200}
            y={-50}
            className="axis-label"
          >
            {
              attributes.filter(
                (attribute) => attribute.value === yAttribute
              )[0].label
            }
          </text>
          {yScale.ticks().map((tickValue, i) => (
            <g transform={`translate(0,${yScale(tickValue)})`} key={i}>
              <text style={{ textAnchor: "end" }} x={-3} dy=".32em">
                {tickValue}
              </text>
            </g>
          ))}
          {/**yscale axis and label */}
          {/**xscale label */}
          <text
            x={-200}
            y={-50}
            style={{ textAnchor: "middle" }}
            x={innerWidth / 2}
            y={innerHeight + 70}
            className="axis-label"
          >
            {
              attributes.filter(
                (attribute) => attribute.value === xAttribute
              )[0].label
            }
          </text>
          {xScale.ticks().map((tickValue, i) => (
            <g transform={`translate(${xScale(tickValue)},0)`} key={i}>
              <text
                style={{ textAnchor: "middle", fontSize: "12" }}
                dy=".71em"
                y={height - 60}
              >
                {tickValue}
              </text>
            </g>
          ))}
          <g opacity={hoveredValue ? 0.2 : 1}>
            {data.map((d, i) => (
              <circle
                cx={xScale(xValue(d))}
                cy={yScale(yValue(d))}
                r={7}
                key={i}
                fill={colorScale(colorValue(d))}
              >
                <title>{d[xAttribute]}</title>
              </circle>
            ))}
          </g>
          {/**the data that has been hovered on */}
          <g>
            {filteredData.map((d, i) => (
              <circle
                cx={xScale(xValue(d))}
                cy={yScale(yValue(d))}
                r={7}
                key={i}
                fill={colorScale(colorValue(d))}
              >
                <title>{d[xAttribute]}</title>
              </circle>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}

export default ScatterPlot;
