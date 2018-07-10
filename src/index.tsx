import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './Containers/App';
import './index.css';
import {Provider} from "react-redux";
import {store} from "./Redux/store";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Provider store={store as any}>
        <App />
    </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
