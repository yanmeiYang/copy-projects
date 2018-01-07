/**
 *  Created by BoGao on 2017-12-19;
 */
import { wget as wgetUtil } from 'utils';

// import { sysconfig } from 'systems';
// const { api } = config;

export async function wget(url) {
  return wgetUtil(url);
  // wget(url)
  //   .then((data) => {
  //     this.setState({ data });
  //     console.log('Data is :', data);
  //   });
}
