import Inferno from 'inferno';
import Bar from './graph/bar.jsx';
import Path from './graph/path.jsx';

const message = "Hello world";

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

const renderFromJSON = async (url) => {
  const data = await loadData(url) || null;

  const signatures = data.map(d => d.numberOfSignatures);
  const max = signatures.reduce((acc, it) => Math.max(acc, it));

  Inferno.render(
    <figure style='white-space: nowrap;'>
      <svg>
        {
          Path(signatures)
        }
      </svg>
    </figure>,
    document.getElementById("ukpi")
  );
}

renderFromJSON('petitions.json');