/* eslint-disable react/no-find-dom-node */
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import styles from './Spinner.less';

class Spinner extends React.PureComponent {

  componentWillUpdate(nextProps, nextState) {
    const me = ReactDOM.findDOMNode(this);
    if (me) {
      window.me = me;
      const parent = me.parentElement;
      if (nextProps.loading) {
        if (parent.className.indexOf('filterBlur') < 0) {
          parent.className += ' filterBlur';
        }
      } else {
        parent.className = parent.className.replace('filterBlur', '');
      }
    }
  }

  render() {
    const svgCls = classnames({
      [styles.spinner]: true,
      [styles.show]: this.props.loading,
    });
    return (
      <div className={`spinnerMask ${this.props.loading ? 'mshow' : 'mhide'}`}>
        <svg className={svgCls} width="44px" height="44px" viewBox="0 0 44 44">
          <circle className={styles.path} fill="none" strokeWidth="4" strokeLinecap="round"
                  cx="22" cy="22" r="20" />
        </svg>
      </div>
    );
  }
}

Spinner.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default Spinner;
