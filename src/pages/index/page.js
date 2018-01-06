import Link from 'umi/link';
import Count from 'components/Count';
import styles from './page.css';
import { engine } from 'core';
import Layout from 'components/Layout';

engine.router(() => {
  return (
    <Layout>
      <div className={styles.normal}>
        <h2>Index Page</h2>
        <Count />
        <br />
        <div>
          <Link to="/list">Go to list.html</Link>
          <br />
          <Link to="/test/test-page">Go to Test</Link>
        </div>
      </div>
    </Layout>
  );
});

export default engine.start();
