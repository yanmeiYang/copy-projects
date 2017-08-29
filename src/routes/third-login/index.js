/**
 * Created by ranyanchuan on 2017/8/18.
 */
import React from 'react';
import Tencent3rd from './tencent';
import { sysconfig } from '../../systems';
class ThirdLogin extends React.PureComponent {
  render() {
    return (
      <div>
        {sysconfig.SOURCE === 'tencent' &&
        <Tencent3rd />
        }
      </div>
    );
  }
}
export default ThirdLogin;
