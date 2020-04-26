import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

export function configureStore(reducer, epic) {
    const epicMiddleware = createEpicMiddleware();
    const store = createStore(
        reducer,
        applyMiddleware(epicMiddleware)
    );
    epicMiddleware.run(epic);
    return store;
}