import React                from 'react';
import {render}           from 'react-dom';
import ReactGA from 'react-ga'
import {Router}           from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import {Provider}         from 'react-redux';
import * as reducers        from 'reducers';
import doRefresh            from 'daos/doRefresh';
import routes               from 'routes';
import Immutable            from 'immutable';
import thunk                from 'redux-thunk';
import promiseMiddleware    from 'lib/promiseMiddleware';
import immutifyState        from 'lib/immutifyState';
import {
    createStore,
    combineReducers,
    applyMiddleware
}  from 'redux';

import axios from 'axios';

import '../shared/styles/main.less';

import {reducer as formReducer} from 'redux-form'
import {SCHEMA_VER} from '../shared/reducers/SiteReducer';

import initCart from '../shared/Cart/Helpers/initCart';
import persistCart from '../shared/Cart/Helpers/persistCart';

/**
 * Validate cached store schema version
 *
 */
const validateVersion = (state) => {
    const valid = (state.site && state.site.schemaVersion === SCHEMA_VER);

    return (valid) ? state : {};
};

const getInitialState = (state) => {
    state = initCart(state);

    return validateVersion(state);
};

const initialState = immutifyState(getInitialState(window.__INITIAL_STATE__));

const history = createBrowserHistory();

const reducer = combineReducers({
    form: formReducer,
    ...reducers
});

const store = applyMiddleware(thunk, promiseMiddleware)(createStore)(
    reducer, initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

var env = "prod"

if (process.env.NODE_ENV != "production") {
    env = "dev"
} else {
    console.log("index.jsx env=" + process.env.NODE_ENV)
    console.log("Initialize GA")
    ReactGA.initialize("UA-51062432-1", {
        debug: false
    });
}

var country = "us"
var player = {episode: undefined, is_playing: false, has_shown: false}

store.dispatch({type: "SET_STORE_ENVIRONMENT", payload: env})
store.dispatch({type: "SET_BLOG_ENVIRONMENT", payload: env})
store.dispatch({type: "SET_COUNTRY", payload: country})
store.dispatch({type: "INITIALIZE_PLAYER", payload: player})
store.dispatch({type: "INITIALIZE_SITE", payload: {dispatch: store.dispatch}})

setTimeout(function () {
    doRefresh(store, env)
}, 500)

store.subscribe(() => {
    const state = store.getState();
    const nstate = {};
    const keys = Object.keys(state);
    for (let i=0; i < keys.length; i++) {
        const key = keys[i];
        const val = state[key];
        try {
            // fix for non immutable states
            // f.e. redux-forms
            nstate[key] = val.toJS();
            if (key === "player") {
                nstate[key].is_playing = false
            }

        } catch (e) {

        }
    }

    delete nstate.checkout;
    delete nstate.recording;

    const s = JSON.stringify(nstate);
    localStorage.setItem('reduxState', s);

    persistCart(nstate);
});

render(
    <Provider store={store}>
        <Router children={routes} history={history}/>
    </Provider>,
    document.getElementById('react-view')
);
