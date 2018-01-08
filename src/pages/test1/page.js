// import Link from 'umi/link';
// import dva from 'dva';
// import Count from 'components/Count';
// import styles from './page.css';
// import { engine } from 'engine';
// import Layout from 'components/Layout';
//
// const app = dva();
// app.model(require('models/app').default);
// app.model(require('models/count').default);
//
// console.log(">>>>> render page 1");
//
// app.router(() => {
//   return (
//     <Layout>
//       <div className={styles.normal}>
//         <h2>Index Page</h2>
//         <Count />
//         <br />
//         <div>
//           <Link to="/list">Go to list.html</Link>
//         </div>
//       </div>
//     </Layout>
//   );
// });

// export default app.start();

import React from 'react';
import Link from 'umi/link';
import Count from 'components/Count';
import styles from './page.css';
import { engine, Page } from 'engine';

const r = () => {
  const result = (
    <div className={styles.normal}>
      <h2>Test1 Page</h2>
      <br />
      <Count />
      <div>
        <Link to="/list">Go to list.html</Link>
        <br />
        <Link to="/index">Go Home</Link>
        <br />
        <Link to="/test1">Test1 Page</Link>
        <br />
        <Link to="/test2">Test2 Page</Link>
        <br />
      </div>
    </div>
  );
  return result;
};

// engine.router(() => <div>替换掉了。。。。我的妈呀</div>);
// const bb = engine.start();
export default Page(r)

// export default engine.start();


// import Link from 'umi/link';
// import dva from 'dva';
// import Count from 'components/Count';
// import styles from './page.css';
// import { engine } from 'engine';
// import { Layout as LayoutComponent } from 'antd';
//
// const app = dva();
// app.model(require('models/count')
//   .default);
//
// console.log(">>>>> render page 1");
//
// app.router(() => {
//   return (
//     <LayoutComponent className={styles.normal}>
//       <h2>Index Page</h2>
//       <Count />
//       <br />
//       <div>
//         <Link to="/list">Go to list.html</Link>
//       </div>
//     </LayoutComponent>
//   );
// });
//
// export default app.start();


// import Link from 'umi/link';
// import Count from 'components/Count';
// import styles from './page.css';
// import { engine } from 'engine';
// import { Layout as LayoutComponent } from 'antd';
//
//
// engine.model(require('models/count').default);
//
// console.log(">>>>> render page 1");
//
// engine.router(() => {
//   return (
//     <LayoutComponent className={styles.normal}>
//       <h2>Index Page</h2>
//       <Count />
//       <br />
//       <div>
//         <Link to="/list">Go to list.html</Link>
//         <br />
//         <Link to="/test/test-page">TEST---</Link>
//       </div>
//     </LayoutComponent>
//   );
// });
//
// export default engine.start();
