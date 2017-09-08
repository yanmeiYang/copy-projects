// import PropTypes from 'prop-types';
import App from 'routes/app';
import { RouterRegistry, RouterRegistry2b, RouterJSXFunc } from '../router-registry';

const routes = [
  ...RouterRegistry2b,
  ...RouterRegistry,
  // Add you own route registry.
];

const Routers = ({ history, app }) => {
  const RootComponent = App;
  return RouterJSXFunc(history, app, routes, RootComponent);
};

// Routers.propTypes = {
//   history: PropTypes.object,
//   app: PropTypes.object,
// };

export default Routers;
