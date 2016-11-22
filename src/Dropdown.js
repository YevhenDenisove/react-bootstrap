import classNames from 'classnames';
import activeElement from 'dom-helpers/activeElement';
import contains from 'dom-helpers/query/contains';
import keycode from 'keycode';
import React, { cloneElement } from 'react';
import ReactDOM from 'react-dom';
import all from 'react-prop-types/lib/all';
import elementType from 'react-prop-types/lib/elementType';
import isRequiredForA11y from 'react-prop-types/lib/isRequiredForA11y';
import uncontrollable from 'uncontrollable';
import warning from 'warning';

import ButtonGroup from './ButtonGroup';
import DropdownMenu from './DropdownMenu';
import DropdownToggle from './DropdownToggle';
import { bsClass as setBsClass, prefix } from './utils/bootstrapUtils';
import createChainedFunction from './utils/createChainedFunction';
import { exclusiveRoles, requiredRoles } from './utils/PropTypes';
import ValidComponentChildren from './utils/ValidComponentChildren';

const TOGGLE_ROLE = DropdownToggle.defaultProps.bsRole;
const MENU_ROLE = DropdownMenu.defaultProps.bsRole;

const propTypes = {
  /**
   * The menu will open above the dropdown button, instead of below it.
   */
  dropup: React.PropTypes.bool,

  /**
   * An html id attribute, necessary for assistive technologies, such as screen readers.
   * @type {string|number}
   * @required
   */
  id: isRequiredForA11y(React.PropTypes.oneOfType([
    React.PropTypes.string, React.PropTypes.number,
  ])),

  componentClass: elementType,

  /**
   * The children of a Dropdown may be a `<Dropdown.Toggle>` or a `<Dropdown.Menu>`.
   * @type {node}
   */
  children: all(
    requiredRoles(TOGGLE_ROLE, MENU_ROLE),
    exclusiveRoles(MENU_ROLE)
  ),

  /**
   * Whether or not component is disabled.
   */
  disabled: React.PropTypes.bool,

  /**
   * Align the menu to the right side of the Dropdown toggle
   */
  pullRight: React.PropTypes.bool,

  /**
   * Whether or not the Dropdown is visible.
   *
   * @controllable onToggle
   */
  open: React.PropTypes.bool,

  /**
   * A callback fired when the Dropdown closes.
   */
  onClose: React.PropTypes.func,

  /**
   * A callback fired when the Dropdown wishes to change visibility. Called with the requested
   * `open` value.
   *
   * ```js
   * function(Boolean isOpen) {}
   * ```
   * @controllable open
   */
  onToggle: React.PropTypes.func,

  /**
   * A callback fired when a menu item is selected.
   *
   * ```js
   * (eventKey: any, event: Object) => any
   * ```
   */
  onSelect: React.PropTypes.func,

  /**
   * If `'menuitem'`, causes the dropdown to behave like a menu item rather than
   * a menu button.
   */
  role: React.PropTypes.string,

  /**
   * Which event when fired outside the component will cause it to be closed
   */
  rootCloseEvent: React.PropTypes.oneOf(['click', 'mousedown']),

  /**
   * @private
   */
  onMouseEnter: React.PropTypes.func,
  /**
   * @private
   */
  onMouseLeave: React.PropTypes.func,
};

const defaultProps = {
  componentClass: ButtonGroup,
};

class Dropdown extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this._focusInDropdown = false;
    this.lastOpenEventType = null;
  }

  componentDidMount() {
    this.focusNextOnOpen();
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.open && this.props.open) {
      this._focusInDropdown = contains(
        ReactDOM.findDOMNode(this.menu), activeElement(document)
      );
    }
  }

  componentDidUpdate(prevProps) {
    const { open } = this.props;
    const prevOpen = prevProps.open;

    if (open && !prevOpen) {
      this.focusNextOnOpen();
    }

    if (!open && prevOpen) {
      // if focus hasn't already moved from the menu lets return it
      // to the toggle
      if (this._focusInDropdown) {
        this._focusInDropdown = false;
        this.focus();
      }
    }
  }

  handleClick() {
    if (this.props.disabled) {
      return;
    }

    this.toggleOpen('click');
  }

  handleKeyDown(event) {
    if (this.props.disabled) {
      return;
    }

    switch (event.keyCode) {
      case keycode.codes.down:
        if (!this.props.open) {
          this.toggleOpen('keydown');
        } else if (this.menu.focusNext) {
          this.menu.focusNext();
        }
        event.preventDefault();
        break;
      case keycode.codes.esc:
      case keycode.codes.tab:
        this.handleClose(event);
        break;
      default:
    }
  }

  toggleOpen(eventType) {
    let open = !this.props.open;

    if (open) {
      this.lastOpenEventType = eventType;
    }

    if (this.props.onToggle) {
      this.props.onToggle(open);
    }
  }

  handleClose() {
    if (!this.props.open) {
      return;
    }

    this.toggleOpen(null);
  }

  focusNextOnOpen() {
    const menu = this.menu;

    if (!menu.focusNext) {
      return;
    }

    if (
      this.lastOpenEventType === 'keydown' ||
      this.props.role === 'menuitem'
    ) {
      menu.focusNext();
    }
  }

  focus() {
    const toggle = ReactDOM.findDOMNode(this.toggle);

    if (toggle && toggle.focus) {
      toggle.focus();
    }
  }

  renderToggle(child, props) {
    let ref = c => { this.toggle = c; };

    if (typeof child.ref === 'string') {
      warning(false,
        'String refs are not supported on `<Dropdown.Toggle>` components. ' +
        'To apply a ref to the component use the callback signature:\n\n ' +
        'https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute'
      );
    } else {
      ref = createChainedFunction(child.ref, ref);
    }

    return cloneElement(child, {
      ...props,
      ref,
      bsClass: prefix(props, 'toggle'),
      onClick: createChainedFunction(
        child.props.onClick, this.handleClick
      ),
      onKeyDown: createChainedFunction(
        child.props.onKeyDown, this.handleKeyDown
      ),
    });
  }

  renderMenu(child, { id, onClose, onSelect, rootCloseEvent, ...props }) {
    let ref = c => { this.menu = c; };

    if (typeof child.ref === 'string') {
      warning(false,
        'String refs are not supported on `<Dropdown.Menu>` components. ' +
        'To apply a ref to the component use the callback signature:\n\n ' +
        'https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute'
      );
    } else {
      ref = createChainedFunction(child.ref, ref);
    }

    return cloneElement(child, {
      ...props,
      ref,
      labelledBy: id,
      bsClass: prefix(props, 'menu'),
      onClose: createChainedFunction(
        child.props.onClose, onClose, this.handleClose,
      ),
      onSelect: createChainedFunction(
        child.props.onSelect, onSelect, this.handleClose,
      ),
      rootCloseEvent
    });
  }

  render() {
    const {
      componentClass: Component,
      id,
      dropup,
      disabled,
      pullRight,
      open,
      onClose,
      onSelect,
      role,
      bsClass,
      className,
      rootCloseEvent,
      children,
      ...props
    } = this.props;

    delete props.onToggle;

    const classes = {
      [bsClass]: true,
      open,
      disabled,
    };

    if (dropup) {
      classes[bsClass] = false;
      classes.dropup = true;
    }

    // This intentionally forwards bsSize and bsStyle (if set) to the
    // underlying component, to allow it to render size and style variants.

    return (
      <Component
        {...props}
        className={classNames(className, classes)}
      >
        {ValidComponentChildren.map(children, child => {
          switch (child.props.bsRole) {
            case TOGGLE_ROLE:
              return this.renderToggle(child, {
                id, disabled, open, role, bsClass,
              });
            case MENU_ROLE:
              return this.renderMenu(child, {
                id, open, pullRight, bsClass, onClose, onSelect, rootCloseEvent,
              });
            default:
              return child;
          }
        })}
      </Component>
    );
  }
}

Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

setBsClass('dropdown', Dropdown);

const UncontrolledDropdown = uncontrollable(Dropdown, { open: 'onToggle' });

UncontrolledDropdown.Toggle = DropdownToggle;
UncontrolledDropdown.Menu = DropdownMenu;

export default UncontrolledDropdown;
