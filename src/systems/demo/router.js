import crossHeat from 'routes/cross-heat/router-ch';
import App from 'routes/app';
import { RouterRegistry, RouterRegistry2b, RouterJSXFunc } from '../router-registry';

const routes = [
  crossHeat.Cross,
  crossHeat.Heat,
];

const Routers = ({ history, app }) => {
  return RouterJSXFunc(history, app, routes, App);
};
export default Routers;
