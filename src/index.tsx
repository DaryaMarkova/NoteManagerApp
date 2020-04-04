import * as serviceWorker from './serviceWorker';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware} from 'redux';
import { appReducer } from './reducers/treeReducer';
import './index.css';

const appStore = createStore(
    appReducer,
    applyMiddleware(thunk)
);

ReactDOM.render(
    <Provider store={appStore}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>,
    </Provider>,
    document.getElementById('root')
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
