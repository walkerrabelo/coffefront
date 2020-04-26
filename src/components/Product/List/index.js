import React, { useEffect } from 'react'
import ProductItem from '../Item'

const ProductList = ({
    products,
    fetchList,
    isFetching,
    error,
}) => {
    useEffect(()=>{
        fetchList()
    }, [])
    useEffect(()=>{
        console.log('Products: ')
        console.log(products)
    }, [products])
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