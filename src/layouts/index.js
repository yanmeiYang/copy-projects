import React from 'react';
import { withIntl } from 'engine';

function Layout({ children, location }) {
  return withIntl(children);
}

export default Layout;
