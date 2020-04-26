import React from 'react'
import Button from '@material-ui/core/Button';

import { connect } from 'react-redux'
import withImmutablePropsToJS from 'with-immutable-props-to-js'

import { actionCreators, selectors } from '../../ducks/product.duck'

import ProductForm from './Form'
import ProductList from './List'

const ProductContainer = ({
    //Data
    list,
    isFetching,
    isSaving,
    isDeleting,
    error,
    //Actions
    fetchList,
    insertProduct,
    updateProduct,
    deleteProduct,
}) => {
    return (
        <>
            <ProductForm/>
            <ProductList products={list}
                            fetchList={fetchList}
                            isFetching={isFetching}
                            error={error}/>
            <Button>Add Product</Button>
        </>
    )
}

const mapStateToProps = state => ({
    list        : selectors.list(state),
    isFetching  : selectors.isFetching(state),
    isSaving    : selectors.isSaving(state),
    isDeleting  : selectors.isDeleting(state),    
    error       : selectors.error(state),
})

const mapDispatchToProps = {
    fetchList       : actionCreators.fetchList.request,
    insertProduct   : (...args) => actionCreators.insert.request(...args),
    updateProduct   : (...args) => actionCreators.update.request(...args),
    deleteProduct   : (...args) => actionCreators.delete.request(...args),
}

export default connect(mapStateToProps, mapDispatchToProps)(withImmutablePropsToJS(ProductContainer))
