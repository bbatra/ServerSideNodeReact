/**
 * Created by bharatbatra on 11/10/17.
 */
import renderHTML from '../views/indexHTML.js';
import renderReactApp from '../views/reactApp';

function render(req, res, next) {

  const layoutOptions = {
    bundleJS: 'static/scripts/bundle.js'
  };

  //ANY CLIENT SIDE CONFIG GOES HERE
  const clientConfig = {};

  const reactApp = renderReactApp();
  const fullHTML = renderHTML(layoutOptions, reactApp.html, clientConfig);
  res.send(fullHTML);
}

export default {
  render
}

