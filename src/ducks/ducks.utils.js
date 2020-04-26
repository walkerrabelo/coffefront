import { combineEpics, ofType } from 'redux-observable';
import { createSelector } from 'reselect'
import { of } from 'rxjs'
import { mergeMap, map, catchError } from 'rxjs/operators'
import { fromJS } from 'immutable'


///////////////////////////////////// Action Types //////////////////////////////////////
export const createRequestActionType = (baseType) => ({
    request  : baseType,
    fulfill  : `${baseType}Fulfilled`,
    fail     : `${baseType}Failed`,
    complete : `${baseType}Complete`
})

export const wrapActionTypes = (prefix) => (typesTree)  => {
    if (typeof typesTree === 'string') {
        return `${prefix}/${typesTree}`
    }
    // otherwise, typeof typesTree === 'object'
    return Object.entries(typesTree).reduce(
        (tree, [key, value]) => ({...tree, [key]: wrapActionTypes(prefix)(value)}),
        {}
    )
}

//////////////////////////////////// Action Creators ////////////////////////////////////
export const createActionCreators = (payloadCreators) => (types) => (
    Object.entries(payloadCreators).reduce(
        (obj, [key, createPayload]) => ({
            ...obj,
            [key]: (...args) => ({
                type: types[key],
                ...(!!createPayload && { payload: createPayload(...args) })
            })
        }),
        {}
    )
)

export const createRequestActionCreators = ({
    request  = false,
    fulfill  = (response) => response,
    fail     = (error) => error,
    complete = false
} = {}) => (
    createActionCreators({request, fulfill, fail, complete})
)

/////////////////////////////////////// Reducers ////////////////////////////////////////
const flattenTreeWithTypes = (treeNode, typesTree) => {
    const isLeafNode = Array.isArray(treeNode) || typeof treeNode !== 'object'
    if (isLeafNode) {
        return { [typesTree]: treeNode }
    }
    return Object.assign(
        {},
        ...Object.keys(treeNode).map( (key) => flattenTreeWithTypes(treeNode[key], typesTree[key]) )
    )
}

export const createRequestReducerTree = (isRequestingKey, responseKey, errorKey) => ({
    request  : (state, action) => state.set(isRequestingKey, true),
    fulfill  : (state, action) => state.merge({[responseKey]: fromJS(action.payload), [errorKey]: undefined}),
    fail     : (state, action) => state.set(errorKey       , fromJS(action.payload)),
    complete : (state, action) => state.set(isRequestingKey, false),
})

export const createReducer = (getInitialState, reducersByType) => (types) => {
    const reduceDictionary = flattenTreeWithTypes(reducersByType, types)
    const defaultReducer = (state) => state
    return (state = getInitialState(), action) => (
        (reduceDictionary[action.type] || defaultReducer)(state, action)
    )
}

///////////////////////////////////////// Epics /////////////////////////////////////////
export const createBasicEpic = (operations, types) => (action$) => action$.pipe(
    ofType(types),
    ...operations
)

export const createRequestEpicTree = (requestActionCreators) => (service) => ({
    request : [ mergeMap(({ payload }) => service(payload).pipe(
        map(requestActionCreators.fulfill),
        catchError(error => of(requestActionCreators.fail(error))),
    )) ],
    fulfill : [ map(({payload}) => requestActionCreators.complete(payload)) ],
    fail    : [ map(({payload}) => requestActionCreators.complete(payload)) ],
})

export const createRootEpic = (epicOperationsByType) => (types) => {
    return combineEpics(
        ...Object.entries(flattenTreeWithTypes(epicOperationsByType, types))
        .map( ([type, operations]) => createBasicEpic(operations, type) )
    )
}

/////////////////////////////////////// Selectors ///////////////////////////////////////
export const wrapSelectors = (rootSelector, branchSelectors) => Object.assign(
    {},
    ...Object.entries(branchSelectors)
             .map(([selectorName, selector]) => ({ [selectorName]: createSelector(rootSelector, selector) }))
)

///////////////////////////////////////// Ducks /////////////////////////////////////////
export const bindDuckToTypes = ({
    bindActionCreators,
    bindReducer,
    bindEpic
} = {}) => (actionTypes) => {
    const actionCreators = bindActionCreators(actionTypes)
    const reducer = bindReducer(actionTypes)
    const epic = bindEpic(actionCreators)(actionTypes)
    return { actionTypes, actionCreators, reducer, epic }
}