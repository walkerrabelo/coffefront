import React from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'

const ProductForm = ({
    className, 
    product,
    insertProduct,
}) => {

    return (
        <Formik initialValues={{name: '', description: ''}}
                onSubmit={insertProduct}>
            <Form>
                <label>Nome:
                    <Field type="text" name="name"/>
                </label>
                <label>Descrição:
                    <Field type="text" name="description"/>
                </label>
                <button type="submit">
                    Salvar
                </button>
            </Form>
        </Formik>
    )

}

export default ProductForm