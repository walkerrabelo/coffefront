import React from 'react'

const ProductItem = ({className, product}) => {
    return (
        <span className={className}>
            <span className={`${className}__name`}>{product.name}</span>
            <span className={`${className}__description`}>{product.description}</span>
        </span>
    )
}

export default ProductItem