import React, { useEffect, useState } from "react";
import { json, geoNaturalEarth1, geoPath } from "d3";
import { feature, mesh } from "topojson-client";

function WorldMap() {
  const [data, setData] = useState([]);
  const jsonUrl = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";

  console.log(data);
  const projection = geoNaturalEarth1();
  const path = geoPath(projection);
  useEffect(() => {
    json(jsonUrl).then((topology) => {
      const { countries, land } = topology.objects;
      setData({
        land: feature(topology, land),
        interiors: mesh(topology, countries, (a, b) => a !== b),
      });
    });
  }, []);

  const width = 960;
  const height = 500;

  return (
    <div>
      <svg width={width} height={height}>
        <g className="points">
          <path className="sphere" d={path({ type: "Sphere" })} />
          {data.land?.features.map((feature, i) => (
            <path className="land" d={path(feature)} key={i} />
          ))}
          <path className="interiors" d={path(data?.interiors)} />
        </g>
      </svg>
    </div>
  );
}

export default WorldMap;
