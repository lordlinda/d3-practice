import React, { useEffect, useState } from "react";
import {
  json,
  geoNaturalEarth1,
  geoPath,
  csv,
  geoGraticule,
  max,
  scaleSqrt,
} from "d3";
import { feature, mesh } from "topojson-client";

function WorldMap() {
  const [data, setData] = useState([]);
  const [cities, setCities] = useState([]);
  const jsonUrl = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";
  const csvUrl =
    "https://gist.githubusercontent.com/curran/13d30e855d48cdd6f22acdf0afe27286/raw/0635f14817ec634833bb904a47594cc2f5f9dbf8/worldcities_clean.csv";

  const projection = geoNaturalEarth1();
  const path = geoPath(projection);
  const graticule = geoGraticule();

  useEffect(() => {
    json(jsonUrl).then((topology) => {
      const { countries, land } = topology.objects;
      setData({
        land: feature(topology, land),
        interiors: mesh(topology, countries, (a, b) => a !== b),
      });
    });
  }, []);

  useEffect(() => {
    const row = (d) => {
      d.lat = +d.lat;
      d.lng = +d.lng;
      d.population = +d.population;
      return d;
    };
    csv(csvUrl, row).then(setCities);
  }, []);

  const width = 960;
  const height = 500;
  const maxRadius = 15;
  const sizeValue = (d) => d.population;
  const sizeScale = scaleSqrt()
    .domain([0, max(cities, (d) => d.population)])
    .range([0, maxRadius]);

  const { interiors, land } = data;
  return (
    <div>
      <svg width={width} height={height}>
        <g className="points">
          <path className="sphere" d={path({ type: "Sphere" })} />
          <path className="graticules" d={path(graticule())} />

          {land?.features.map((feature, i) => (
            <path className="land" d={path(feature)} key={i} />
          ))}
          <path className="interiors" d={path(interiors)} />
          {cities?.map((d, i) => {
            const [x, y] = projection([d.lng, d.lat]);
            return (
              <circle
                cx={x}
                cy={y}
                r={sizeScale(sizeValue(d))}
                key={i}
                className="city"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default WorldMap;
