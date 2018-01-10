/* eslint-disable react/no-find-dom-node */
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { classnames } from 'utils';
import styles from './Spinner.less';

export default class Spinner extends PureComponent {
  constructor(props) {
    super(props);
    this.nomask = props.nomask;
    this.type = props.type || 'blur'; // blur, dark, light
  }

  componentDidMount = () => {
    this.update(this.props.loading);
  };

  componentWillUpdate(nextProps) {
    this.update(nextProps.loading);
  }

  update = (loading) => {
    if (!this.nomask) {
      const me = ReactDOM.findDOMNode(this);
      if (me) {
        window.me = me;
        const parent = me.parentElement;
        if (parent) {
          this.height = parent.offsetHeight;
          this.width = parent.offsetWidth;
          const parentClassName = `parentSpinner_${this.type}`;
          if (loading) {
            if (parent.className.indexOf(parentClassName) < 0) {
              parent.className += ` ${parentClassName}`;
            }
          } else {
            parent.className = parent.className.replace(parentClassName, '');
          }
        }
      }
    }
  };

  render() {
    const svgCls = classnames({
      [styles.spinner]: true,
      [styles.show]: this.props.loading,
    });
    return (
      <div
        className={`spinnerMask ${this.props.loading ? 'mshow' : 'mhide'} type_${this.type}`}
        style={{ height: this.height, width: this.width }}
      >
        <svg className={svgCls} width="44px" height="44px" viewBox="0 0 44 44">
          <circle className={styles.path} fill="none" strokeWidth="4" strokeLinecap="round"
                  cx="22" cy="22" r="20" />
        </svg>
      </div>
    );
  }
}
