import Link from 'umi/link';
import Count from 'components/Count';
import styles from './page.css';
import { engine } from 'core';

engine.model(require('models/count').default);

console.log("PAGE test-page 666666666666666666666666666666666666666666");

engine.router(() => {
  return (
    <div className={styles.normal}>
      <h2>rest Page</h2>
      <Count />
      <br />
      <div>
        <Link to="/list">Go to list.html</Link>
        <br />
        <Link to="/index">Go Home</Link>
      </div>
    </div>
  );
});

export default engine.start();
