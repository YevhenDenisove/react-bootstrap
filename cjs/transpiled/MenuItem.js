"use strict";
/** @jsx React.DOM */

var React = require("./react-es6")["default"];

var MenuItem = React.createClass({displayName: 'MenuItem',
  propTypes: {
    header: React.PropTypes.bool,
    divider: React.PropTypes.bool
  },

  handleClick: function () {
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(this.props.key);
    }
  },

  renderAnchor: function () {
    return (
      React.DOM.a( {onClick:this.handleClick, href:"#", tabIndex:"-1", ref:"anchor"}, 
        this.props.children
      )
    );
  },

  render: function () {
    var className = null;
    var children = null;

    if (this.props.header) {
      children = this.props.children;
      className = 'dropdown-header';
    } else if (this.props.divider) {
      className = 'divider';
    } else {
      children = this.renderAnchor();
    }

    return this.transferPropsTo(
      React.DOM.li( {role:"presentation", className:className}, 
        children
      )
    );
  }
});

exports["default"] = MenuItem;