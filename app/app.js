import debug from 'debug';

import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import createStore from './redux/create';
import ApiClient from '../shared/api-client';
import universalRender from '../shared/universal-render';

const { NODE_ENV, BROWSER } = process.env;

if (NODE_ENV !== 'production') debug.enable('dev');
if (BROWSER) require('styles/app.css');

(async function() {
  try {
    const store = createStore(new ApiClient(), window.__state);
    const history = createBrowserHistory();
    const container = window.document.getElementById('content');
    const element = await universalRender({ history, store });

    // render application in browser
    ReactDOM.render(element, container);

    // clean state of `redux-resolver`
    store.resolver.firstRender = false;
    store.resolver.pendingActions = [];
  } catch (error) {
    debug('dev')('Error with first render');
    throw error;
  }
})();
