export const AxisBottom = ({ xScale, innerHeight, tickFormat }) =>
  xScale.ticks().map((tickValue) => (
    <g
      className="tick"
      transform={`translate(${xScale(tickValue)},0)`}
      key={tickValue}
    >
      <line y2={innerHeight} stroke="black" />
      <text
        style={{ textAnchor: "middle", fontSize: "12" }}
        dy=".71em"
        y={innerHeight + 3}
      >
        {tickFormat(tickValue)}
      </text>
    </g>
  ));
