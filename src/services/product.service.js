import { createCrudServices } from './services.utils'

export const { fetchList,
               insert : insertProduct,
               update : updateProduct,
               delete : deleteProduct } = createCrudServices('http://localhost:8080/product')
               