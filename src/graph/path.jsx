import * as d3 from 'd3-path';

const pathForData = viewBox => (data, max) => {
  const path = d3.path();
  path.moveTo(0,viewBox.h);

  for (let d in data) {
    path.lineTo(d / data.length * 100, viewBox.h - data[d] / max * viewBox.h);
  }
  return path.toString();
}

const Path = viewBox => data => (
  <path
    d={pathForData(viewBox)(data, data.reduce((acc, it) => Math.max(acc, it)))}
    stroke="white"
    stroke-width={0.3 * viewBox.w / 100}
    stroke-linejoin="round"
    fill="transparent"
  />
);

export default Path;