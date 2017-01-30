import * as d3 from 'd3-path';

const pathForData = (data, max) => {
  const path = d3.path();
  path.moveTo(0,0);
  for (let d in data) {
    path.lineTo(d, data[d] / max * 800);
  }
  return path.toString();
}

const Path = data => (
  <path
    d={pathForData(data, data.reduce((acc, it) => Math.max(acc, it)))}
    stroke="blue"
    stroke-width="1"
  />
);

export default Path;