import React from 'react'

const ProductItem = ({className, product}) => {
    return (
        <span className={className}>
            {product.name}
        </span>
    )
}

export default ProductItem