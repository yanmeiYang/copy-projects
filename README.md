# Aminer2b


## Documentation Draft

Build内存溢出可以用下面方式build.
```javascript
node --max_old_space_size=4096 node_modules/roadhog/lib/build.js --analyze  
```


## Development Environment / IDE Setup

IDE：WebStorm Latest version.

### IDE Settings
1. Open webstrom preference page: WebStrom -> Preferences -> Languages & Frameworks -> JavaScript: 
1. Under [JavaScript language version], select "React JSX".
1. Under [Node.js and NPM] Enable Node.js Core library.
1. Under "Code Quality Tools", Enable "ESLint".
1. Open preference, search webpack, change configuration file to webpack.config.webstorm.js

### DVA2.0 Updates

###### Use Absolute Path to `import` packages. (Webpack alias)
```javascript
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
```javascript
  UniSearch: {
    path: '/uniSearch/:query/:offset/:size',
    models: () => [
      import('models/search'),
      import('models/expert-base/expert-base'),
    ],
    component: () => import('routes/search/SearchPage'),
  },
```

### Development Guides

#### Development tips:

##### Common
+ Put one empty line between methods.

##### General
+ Always fork aminer-web prject，then submit a Merge Request.
+ Use i18n on all text.
+ dva@2: Use this.props.match to get parameters in url.
+ Redirect: <Route path={`${match.url}/:id`} component={Person}/>

##### JSX
+ Never use Math.random() as key in JXS loop.
+ Don't use <span></span> to include multiline jsx, indentation not work in webstorm with multiline span.





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

##### Advanced usages of classes
```javascript
import classnames from 'classnames';
const App = (props) => {
  const cls = classnames({
    btn: true,
    btnLarge: props.type === 'submit',
    btnSmall: props.type === 'edit',
  });
  return <div className={ cls } />;
}
```

##### Advanced usages of dva/connect
```javascript
TODO 
```

##### Condition JSX, { and conditions in one line to reduce indentation.
```javascript
{person.tags &&
<div>blabla</div>
}
```

##### Component 组件开发规范.(散)
+ 每个稍微复杂点的Component都应该有一个className.

###### 一个标准的Component
```javascript
@connect(({ app, search, loading }) => ({ app, search, loading }))
@Auth
export default class SearchComponent extends Component {
  static displayName = 'SearchComponent';

  static contextTypes = {
    // some context types
  };

  static propTypes = {
    // className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string,
    disableExpertBaseFilter: PropTypes.bool,
    sorts: PropTypes.array,
    onSearchBarSearch: PropTypes.func,
    showSearchBox: PropTypes.bool, // has search box?
  };

  static defaultProps = {
    disableExpertBaseFilter: false,
  };

  // ...
}
```

## 挖坑

### systems/index.js

1. 命名规定
```javascript
// component名字_驼峰式的名字
// Block: component是一个组件的命名为 xxxBlock
// zone: component为一组组件的命名为 xxxZone
PersonList_TitleRightBlock: defaults.EMPTY_BLOCK_FUNC, // profile => 'jsx',
PersonList_RightZone: defaults.IN_APP_DEFAULT, // [()=><COMP>]
```
2. 默认参数的含义以及使用
    IN_APP_DEFAULT: null
    EMPTY_BLOCK: ''
    EMPTY_BLOCK_FUNC: () => false
    >function使用时需要判断是否为function

    EMPTY_BLOCK_FUNC_LIST: []
    
    >数组在使用时需要判断参数是否存在以及length是否大于0，例如：
    ```javascript
    {RightZoneFuncs && RightZoneFuncs.length > 0 &&
    <div className={styles.person_right_zone}>
        {RightZoneFuncs.map((blockFunc) => {
          return blockFunc ? blockFunc(person) : false;
        })}
    </div>
    }
    ```

3. 默认参数定义的位置

    通用的默认参数可以写到index.js中，
    ```javascript
    Auth_LoginPage: '/login',
    ```

    非通用的默认参数写到component中，例如：    
    ```javascript
    const RightZoneFuncs = rightZoneFuncs || DefaultRightZoneFuncs;
    ```

### Component原则上不引入sysconfig配置文件，需要从上层通过参数(props)的形式传入Component中
```javascript
<PersonList persons={orgs} titleRightBlock={sysconfig.PersonList_TitleRightBlock}
personRemove={sysconfig.Person_PersonRemoveButton} />
```




#### 编发风格规范（Code Style）




##### Code Style of ternary expression (? expression)

```javascript
// If the expression can in one line.
const A = hasValue ? 'has value' : 'no';

// Multiline
<Bundle load={loadSomething}>
  {(Comp) => (Comp
    ? <Comp/>
    : <Loading/>
  )}
</Bundle>
```


## Refactoring TODO
#### Remove the occurence.
  showFooter
  let { query } = queryString.parse(location.search);
  INTERESTS_I18N
  

