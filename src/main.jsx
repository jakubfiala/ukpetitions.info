import Inferno from 'inferno';
import throttle from './utils/throttle.js';
import monthList from './utils/month-list.js';
import Path from './graph/path.jsx';

const message = "Hello world";

const viewBox = {
  x: 0,
  y: 0,
  w: 100,
  h: 40
}

const loadData = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  }
  catch(e) {
    console.error('Error loading petitions data.');
    return null;
  }
}

const nf = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const ZOOM_SPEED = 2;

const zoom = (viewBox, data, xPos) => e => {

  const xSpeed = ZOOM_SPEED * xPos;
  const wSpeed = ZOOM_SPEED * (1 - xPos);

  if (e.movementY > 0) {
    if (viewBox.x > 100 || (viewBox.w - 2 * wSpeed) * 0.4 < 1 ) return;
    viewBox.x = viewBox.x + xSpeed;
    viewBox.w = viewBox.w - 2 * wSpeed;
    viewBox.h = viewBox.w * 0.4;
  }
  else {
    if (viewBox.x < 1) return;
    viewBox.x = viewBox.x - xSpeed;
    viewBox.w = viewBox.w + 2 * wSpeed;
    viewBox.h = viewBox.w * 0.4;
  }

  Inferno.render(
    App(viewBox, data),
    document.getElementById("ukpi")
  );
};

const petitionDate = petition => {
  return new Date(petition.created._value);
}

const App = (viewBox, data) => {
  const firstDate = petitionDate(data[0]);
  const totalSignatures = data.reduce((acc, it) => acc + it.numberOfSignatures, 0);

  const top = data.slice().sort((a, b) => b.numberOfSignatures - a.numberOfSignatures).slice(0, 5);

  const vbx = viewBox.w >= viewBox.x
    ? viewBox.w - viewBox.x
    : (viewBox.w - viewBox.x > 100 ? 100 : viewBox.w - viewBox.x);

  return (
    <div>
    <header>
      <h1>
        ukpetitions.info
        <span class="inline-stats header__petitions-count"> ––– <wbr/>
          <strong>{nf(data.length)}</strong> petitions with <strong>{nf(totalSignatures)}</strong> signatures since <time>{monthList[firstDate.getMonth()]} {firstDate.getFullYear()}</time></span>
      </h1>
    </header>
    <figure>
      <svg viewBox={`${viewBox.x} ${viewBox.y} ${vbx} ${viewBox.h}`} preserveAspectRatio='none'>
        <g id="svg-viewport">
        {
          Path(viewBox)(data.map(d => d.numberOfSignatures))
        }
        </g>
      </svg>
    </figure>
    <section>
      <h3>Top {top.length} petitions by signatures</h3>
      <ol>
      {
        top.map(petition => (
          <li>
            <a href={`https://petition.parliament.uk/petitions/${petition.identifier._value}`}>
            {petition.label._value.replace(/\./g, '')}
            </a> ––– <wbr/>
            <span class="inline-stats">
            <strong>{nf(petition.numberOfSignatures)}</strong> signatures
            </span>
          </li>
        ))
      }
      </ol>
    </section>
    </div>
  );
};

const renderFromJSON = async (url) => {
  const data = await loadData(url) || null;
  data.reverse();

  const main = document.getElementById("ukpi");
  while(main.firstChild) main.removeChild(main.lastChild);

  Inferno.render(
    App(viewBox, data),
    main
  );

  setTimeout(() => {
    const svg = document.querySelector('svg');
    svg.classList.add('animated');

    let zoomHandler = e => {};

    svg.addEventListener('mousedown', e => {

      const xPos = (e.clientX - svg.scrollLeft) / svg.scrollWidth;

      console.log(xPos)

      zoomHandler = throttle(zoom(viewBox, data, xPos));
      svg.addEventListener('mousemove', zoomHandler);
    });

    svg.addEventListener('mouseup', e => svg.removeEventListener('mousemove', zoomHandler));
    svg.addEventListener('mouseout', e => svg.removeEventListener('mousemove', zoomHandler));
  }, 0);
}

renderFromJSON('petitions.json');
