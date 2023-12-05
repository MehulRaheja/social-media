// we need a way for our test to communicate with redux and here it will be done
import { store } from '@redux/store';
import { render } from '@testing-library/react'; // for any component we want to test, we need to call this render method inorder to test that component
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history'; // it will used to interact with the route e.g. when we want to change the route
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      <Router>{children}</Router>
    </Provider>
  );
};
Providers.propTypes = {
  children: PropTypes.node.isRequired // this is an element
};

// to render whatever component we pass
const customRender = (ui, options) => render(ui, { wrapper: Providers, ...options });

// when we test a component and see how url changes
const renderWithRouter = (ui) => {
  const history = createBrowserHistory();
  return {
    history,
    ...render(ui, { wrapper: Providers })
  };
};

// eslint-disable-next-line import/export
export * from '@testing-library/react'; // anything that is needed from @testing-library/react will be exported from this file
// eslint-disable-next-line import/export
export { customRender as render };
export { renderWithRouter };
