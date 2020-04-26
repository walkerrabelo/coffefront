import React, { useEffect } from 'react'
import ProductItem from '../Item'

const ProductList = ({
    products,
    fetchList,
    isFetching,
    error,
}) => {
    useEffect(()=>{ fetchList() }, [])
    return (
        <div>
            <h2>Product List</h2>
            {
                products.map(product => 
                    <ProductItem    key={product.id} 
                                    className='coffee-item'
                                    product={product}
                    />
                )
            }
        </div>
    )
}

export default ProductList