import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import { reducer, epic } from './ducks/product.duck'
import { configureStore } from './util/store-utils'

import './index.css';

import ProductContainer from './components/Product';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

ReactDOM.render(
  <Provider store={configureStore(reducer, epic)}>
    <CssBaseline />
    <Container maxWidth="sm">
      <ProductContainer />
    </Container>
  </Provider>,
  document.getElementById('root')
);
