# Aminer2b

## Development Environment

IDE：WebStorm Latest version.

### IDE Settings
1. Open webstrom preference page: WebStrom -> Preferences -> Languages & Frameworks -> JavaScript: 
1. Under [JavaScript language version], select "React JSX".
1. Under [Node.js and NPM] Enable Node.js Core library.
1. Under "Code Quality Tools", Enable "ESLint".

### DVA2.0 Updates

###### Use Absolute Path to `import` packages. (Webpack alias)
```javascript 1.8
// old
import { PersonList } from '../../component/person';

// new
import { PersonList } from 'component/person';
```

Available alias see webpack.config.js:
```javascript
webpackConfig.resolve.alias = {
  components: `${__dirname}/src/components`,
  utils: `${__dirname}/src/utils`,
  config: `${__dirname}/src/utils/config`,
  enums: `${__dirname}/src/utils/enums`,
  services: `${__dirname}/src/services`,
  models: `${__dirname}/src/models`,
  routes: `${__dirname}/src/routes`,
  themes: `${__dirname}/src/themes`,
  systems: `${__dirname}/src/systems`,
};
```

#### New Route Configs.

### Development Guides

#### Development tips:
+ Always fork aminer-web prject，then submit a Merge Request.
+ Use i18n on all text.
+ dva@2: Use this.props.match to get parameters in url.
+ Redirect: <Route path={`${match.url}/:id`} component={Person}/>


#### Coding Conventions / 编码规范

##### Use ES7 Decorator
```javascript
import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ expertBase }) => ({ expertBase }))
@Auth // Client-side component level authentication.
export default class YourClassName extends Component {
  render() {
    return (
      <div>Your contents</div>
    );
  }
}

```

##### Parse parameters in url.
```javascript
import queryString from 'query-string';

// get params in path

// get params in query and hash
const { view } = queryString.parse(location.search);
const { view } = queryString.parse(location.hash);

```