import { Router, Route, Switch } from 'umi-router';
import dynamic from 'umi/dynamic';
import { default as event, Events } from 'umi/event';

export default function() {

  function callback(key, err) {
    if (!err) {
      event.emit(Events.PAGE_INITIALIZED, { key });
    }
  }

  return (
<Router history={window.g_history}>
  <Switch>
    <Route exact path="/index.html" component={require('../index/page.js').default}></Route>
    <Route exact path="/index2.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/list.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/test/test-page.html" component={require('../test/test-page.js').default}></Route>
    <Route exact path="/" component={require('../index/page.js').default}></Route>
  </Switch>
</Router>
  );
}
