import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import myReducer from "./Reducers/index.reducer";
import {composeWithDevTools} from "redux-devtools-extension";

const store = createStore(
    myReducer,
    composeWithDevTools(applyMiddleware(thunk))
);


export default store;