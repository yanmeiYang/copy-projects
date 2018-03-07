import React from 'react';
import withRouter from 'umi/withRouter';
import { sysconfig } from "systems";
import { resRoot } from "core";
import { Helmet } from 'react-helmet';

function Layout({ children, location }) {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> laoyout withrouter', );
  return (
    <div>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href={`${resRoot}/sys/${sysconfig.SYSTEM}/favicon.ico`}
              rel="icon" type="image/x-icon" />

        <script src={`${resRoot}/lib/icon-font/iconfont.js`} />
        <link rel="stylesheet" href={`${resRoot}/lib/icon-font/iconfont.css`} />
        <link rel="stylesheet" href={`${resRoot}/lib/fa/css/font-awesome.min.css`} />

        {/*{href.indexOf('/lab/knowledge-graph-widget') > 0 &&*/}
        {/*<link rel="stylesheet"*/}
        {/*href="https://cdn.rawgit.com/novus/nvd3/v1.8.1/build/nv.d3.css" />*/}
        {/*}*/}
      </Helmet>
      {children}
    </div>
  );
}

export default withRouter(Layout);
