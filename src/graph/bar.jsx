const Bar = (value, range) => (
  <div style={`
    background: black;
    height: ${value / range * 100}vh;
    width: 1px;
    display: inline-block;
    vertical-align: middle;
  `}>
  </div>
);

export default Bar;