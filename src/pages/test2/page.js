import Link from 'umi/link';
import Count from 'components/Count';
import styles from './page.css';
import { engine } from 'engine';

engine.router(() => {
  return (
    <div className={styles.normal}>
      <h2>Test Page</h2>
      <Count />
      <br />
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
});

export default engine.start();
