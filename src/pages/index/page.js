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

import Link from 'umi/link';
import Count from 'components/Count';
import styles from './page.css';
import { engine } from 'engine';
import Layout from 'components/Layout';
// import { Layout as LayoutComponent } from 'antd';

// engine.model(require('models/count').default);

export default engine.router(() => {
  return (
    <Layout className={styles.normal}>
      <h2>Index Page</h2>
      <br />
      <Count />
      <div>
        <Link to="/list">Go to list.html</Link>
        <br />
        <Link to="/test/test-page">Go to Test</Link>
      </div>
    </Layout>
  );
});

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
