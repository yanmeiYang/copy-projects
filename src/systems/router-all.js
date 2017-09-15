/**
 * Default routes with all router available.
 */
import { RouterRegistry, RouterRegistry2b, RouterJSXFunc } from './router-registry';

const routes = [
  ...RouterRegistry2b,
  ...RouterRegistry,
  // Add you own route registry.
];

const Routers = ({ history, app }) => {
  return RouterJSXFunc(history, app, routes);
};

export default Routers;
