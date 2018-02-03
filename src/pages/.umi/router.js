import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import { default as event, Events } from 'umi/_event';


const Router = window.g_CustomRouter || DefaultRouter;

export default function() {

  function hoc(Component) {
    class App extends React.Component {
      componentDidMount() {
        event.emit(Events.PAGE_INITIALIZED);
      }
      render() {
        console.log('>>>> ',window.g_history );
        return <Component {...this.props} />
      }
    }
    return App;
  }
  console.log('>>>> ',window.g_history );

  return (
<Router history={window.g_history}>
  <Switch>
    <Route exact path="/auth/forgot-password.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/expert-map.html" component={hoc(require('../expert-map/page.js').default)}></Route>
    <Route exact path="/index.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/list.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/login.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/map/career-trajectory.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/map/heatmap.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/search.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/test1.html" component={hoc(require('../test1/page.js').default)}></Route>
    <Route exact path="/test2.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/user/info.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/" component={() => <div>Compiling...</div>}></Route>
  </Switch>
</Router>
  );
}
