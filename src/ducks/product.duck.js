import { List, Record, fromJS } from 'immutable'

import { createRequestActionType,
         wrapActionTypes,
         createRequestActionCreators,
         createRequestReducerTree,
         createReducer,
         createRequestEpicTree,
         createRootEpic,
         bindDuckToTypes } from './ducks.utils'

import { fetchList,
         insertProduct,
         updateProduct,
         deleteProduct } from '../services/product.service';

///////////////////////////////////// Action Types //////////////////////////////////////
export const actionTypes = wrapActionTypes('products')({
    fetchList   : createRequestActionType('fetchList'),
    insert      : createRequestActionType('insert'),
    update      : createRequestActionType('update'),
    delete      : createRequestActionType('delete'),
})

//////////////////////////////////// Action Creators ////////////////////////////////////
export const bindActionCreators = (types) => ({
    fetchList   : createRequestActionCreators()(types.fetchList),
    insert      : createRequestActionCreators({ request: (product) => product })(types.insert),
    update      : createRequestActionCreators({ request: (product) => product })(types.update),
    delete      : createRequestActionCreators({ request: (product) => product })(types.delete), 
})

/////////////////////////////////////// Reducers ////////////////////////////////////////
export const ProductStore = Record({
    list         : List(),
    isFetching   : true,
    isSaving     : false,
    isDeleting   : false,
    error        : undefined
})

const add    = (state, action) => state.set('list', state.list.push(fromJS(action.payload)))
const update = (state, action) => state.set('list', state.list.set(state.list.findIndex(s => s.get('id') === action.payload.id), fromJS(action.payload)))
const remove = (state, action) => state.set('list', state.list.delete(state.list.findIndex(s => s.get('id') === action.payload.id)))

export const bindReducer = createReducer(ProductStore, {
    fetchList : createRequestReducerTree('isFetching', 'list', 'error'),
    insert    : { ...createRequestReducerTree('isSaving'  , null, 'error'), fulfill : add },
    update    : { ...createRequestReducerTree('isSaving'  , null, 'error'), fulfill : update },
    delete    : { ...createRequestReducerTree('isDeleting', null, 'error'), fulfill : remove },
})

export const bindEpic = (actionCreators) => createRootEpic({
    fetchList : createRequestEpicTree(actionCreators.fetchList   )(fetchList),
    insert    : createRequestEpicTree(actionCreators.insert      )(insertProduct),
    update    : createRequestEpicTree(actionCreators.update      )(updateProduct),
    delete    : createRequestEpicTree(actionCreators.delete      )(deleteProduct),
})
/////////////////////////////////////// Selectors ///////////////////////////////////////
export const selectors = {
    list         : (state) => state.list,
    isFetching   : (state) => state.isFetching,
    isSaving     : (state) => state.isSaving,
    isDeleting   : (state) => state.isDeleting,
    error        : (state) => state.error,
}

///////////////////////////////////////// Ducks /////////////////////////////////////////
export const bindSummariesDuck = bindDuckToTypes({
    bindActionCreators,
    bindReducer,
    bindEpic
})

export const { actionCreators, reducer, epic } = bindSummariesDuck(actionTypes)
export default reducer