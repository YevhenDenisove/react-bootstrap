import classNames from 'classnames';
import omit from 'lodash-compat/object/omit';
import React, { cloneElement, PropTypes } from 'react';

import { bsClass as setBsClass, bsStyles, getClassSet, omitBsProps, prefix }
  from './utils/bootstrapUtils';
import { State } from './utils/StyleConfig';
import ValidComponentChildren from './utils/ValidComponentChildren';

const ROUND_PRECISION = 1000;

/**
 * Validate that children, if any, are instances of `<ProgressBar>`.
 */
function onlyProgressBar(props, propName, componentName) {
  const children = props[propName];
  if (!children) {
    return null;
  }

  let error = null;

  React.Children.forEach(children, child => {
    if (error) {
      return;
    }

    if (child.type === ProgressBar) { // eslint-disable-line no-use-before-define
      return;
    }

    const childIdentifier = React.isValidElement(child) ?
      child.type.displayName || child.type.name || child.type :
      child;
    error = new Error(
      `Children of ${componentName} can contain only ProgressBar ` +
      `components. Found ${childIdentifier}.`
    );
  });

  return error;
}

const propTypes = {
  min: PropTypes.number,
  now: PropTypes.number,
  max: PropTypes.number,
  label: PropTypes.node,
  srOnly: PropTypes.bool,
  striped: PropTypes.bool,
  active: PropTypes.bool,
  className: React.PropTypes.string,
  children: onlyProgressBar,

  /**
   * @private
   */
  isChild: PropTypes.bool,
};

const defaultProps = {
  min: 0,
  max: 100,
  active: false,
  isChild: false,
  srOnly: false,
  striped: false
};

function getPercentage(now, min, max) {
  const percentage = (now - min) / (max - min) * 100;
  return Math.round(percentage * ROUND_PRECISION) / ROUND_PRECISION;
}

class ProgressBar extends React.Component {
  renderProgressBar({
    min, now, max, label, srOnly, striped, active, className, style, ...props,
  }) {
    const classes = {
      ...getClassSet(props),
      active,
      [prefix(props, 'striped')]: active || striped,
    };

    return (
      <div
        {...omitBsProps(props)}
        role="progressbar"
        className={classNames(className, classes)}
        style={{ width: `${getPercentage(now, min, max)}%`, ...style }}
        aria-valuenow={now}
        aria-valuemin={min}
        aria-valuemax={max}
      >
        {srOnly ? <span className="sr-only">{label}</span> : label}
      </div>
    );
  }

  render() {
    if (this.props.isChild) {
      return this.renderProgressBar(omit(this.props, ['isChild']));
    }

    const {
      min,
      now,
      max,
      label,
      srOnly,
      striped,
      active,
      bsClass,
      bsStyle,
      className,
      children,
      ...props,
    } = this.props;

    return (
      <div
        {...props}
        className={classNames(className, 'progress')}
      >
        {children ?
          ValidComponentChildren.map(children, child => (
            cloneElement(child, { isChild: true }
          ))) :
          this.renderProgressBar({
            min, now, max, label, srOnly, striped, active, bsClass, bsStyle,
          })
        }
      </div>
    );
  }
}

ProgressBar.propTypes = propTypes;
ProgressBar.defaultProps = defaultProps;

export default setBsClass('progress-bar',
  bsStyles(Object.values(State), ProgressBar)
);
