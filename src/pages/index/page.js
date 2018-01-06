import Link from 'umi/link';
import Count from 'components/Count';
import styles from './page.css';
import { engine } from 'core';

console.log("PAGE Index 22233332222222222222222222");

engine.model(require('models/count').default);

engine.router(() => {
  return (
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
  );
});

export default engine.start();
