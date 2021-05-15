export const Marks = ({ data, yScale, xScale }) =>
  data.map((d, i) => (
    <rect
      className="mark"
      x={0}
      y={yScale(d.Country)}
      height={yScale.bandwidth()}
      width={xScale(d.Population)}
      key={i}
    />
  ));
