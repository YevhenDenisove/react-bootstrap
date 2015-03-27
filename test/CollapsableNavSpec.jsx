import React from 'react';
import ReactTestUtils from 'react/lib/ReactTestUtils';
import Navbar from '../lib/Navbar';
import CollapsableNav from '../lib/CollapsableNav';
import Nav from '../lib/Nav';
import NavItem from '../lib/NavItem';

describe('CollapsableNav', function () {
  it('Should create div and add collapse class', function () {
    let Parent = React.createClass({
      render: function() {
        return (
          <Navbar toggleNavKey={1}>
            <CollapsableNav eventKey={1}>
              <Nav>
                <NavItem eventKey={1} ref='item1'>Item 1 content</NavItem>
                <NavItem eventKey={2} ref='item2'>Item 2 content</NavItem>
              </Nav>
            </CollapsableNav>
            </Navbar>
        );
      }
    });
    let instance = ReactTestUtils.renderIntoDocument(<Parent />);
    assert.ok(ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'navbar-collapse'));
  });

  it('Should handle multiple Nav elements', function () {
    let Parent = React.createClass({
      render: function() {
        return (
          <Navbar toggleNavKey={1}>
            <CollapsableNav eventKey={1} ref='collapsable_object'>
              <Nav>
                <NavItem eventKey={1} ref='item1'>Item 1 content</NavItem>
                <NavItem eventKey={2} ref='item2'>Item 2 content</NavItem>
              </Nav>
              <Nav>
                <NavItem eventKey={1} ref='item1'>Item 1 content</NavItem>
                <NavItem eventKey={2} ref='item2'>Item 2 content</NavItem>
              </Nav>
            </CollapsableNav>
          </Navbar>
        );
      }
    });
    let instance = ReactTestUtils.renderIntoDocument(<Parent />);
    assert.ok(ReactTestUtils.findRenderedComponentWithType(instance.refs.collapsable_object.refs.collapsable_0, Nav));
    assert.ok(ReactTestUtils.findRenderedComponentWithType(instance.refs.collapsable_object.refs.collapsable_1, Nav));
  });

  it('Should just render children and move along if not in <Navbar>', function () {
    let Parent = React.createClass({
      render: function() {
        return (
          <CollapsableNav eventKey={1}>
            <Nav>
              <NavItem eventKey={1} ref='item1'>Item 1 content</NavItem>
              <NavItem eventKey={2} ref='item2'>Item 2 content</NavItem>
            </Nav>
          </CollapsableNav>
        );
      }
    });
    let instance = ReactTestUtils.renderIntoDocument(<Parent />);
    let collapsableNav = ReactTestUtils.findRenderedComponentWithType(instance, CollapsableNav);
    assert.notOk(collapsableNav.getDOMNode().className.match(/\navbar-collapse\b/));
    let nav = ReactTestUtils.findRenderedComponentWithType(collapsableNav.refs.nocollapse_0, Nav);
    assert.ok(nav);
  });

  it('Should retain childrens classes set by className', function () {
    let Parent = React.createClass({
      render: function() {
        return (
          <Navbar toggleNavKey={1}>
            <CollapsableNav eventKey={1} ref='collapsable_object'>
              <Nav>
                <NavItem eventKey={1} ref='item1' className='foo bar'>Item 1 content</NavItem>
                <NavItem eventKey={2} ref='item2' className='baz'>Item 2 content</NavItem>
              </Nav>
            </CollapsableNav>
          </Navbar>
        );
      }
    });
    let instance = ReactTestUtils.renderIntoDocument(<Parent />);
    assert.ok(ReactTestUtils.findRenderedDOMComponentWithClass(instance.refs.collapsable_object.refs.collapsable_0, 'foo'));
    assert.ok(ReactTestUtils.findRenderedDOMComponentWithClass(instance.refs.collapsable_object.refs.collapsable_0, 'bar'));
    assert.ok(ReactTestUtils.findRenderedDOMComponentWithClass(instance.refs.collapsable_object.refs.collapsable_0, 'baz'));
  });

  it('Should should not duplicate classes', function () {
    let Parent = React.createClass({
      render: function() {
        return (
          <Navbar toggleNavKey={1}>
            <CollapsableNav eventKey={1} ref='collapsable_object' className='foo navbar-collapse'>
              <Nav>
                <NavItem eventKey={1} ref='item1' className='foo bar'>Item 1 content</NavItem>
                <NavItem eventKey={2} ref='item2' className='baz'>Item 2 content</NavItem>
              </Nav>
            </CollapsableNav>
          </Navbar>
        );
      }
    });
    let instance = ReactTestUtils.renderIntoDocument(<Parent />);
    let classDOM = ReactTestUtils.findRenderedDOMComponentWithTag(instance.refs.collapsable_object, 'DIV').props.className
        , classArray = classDOM.split(' ')
        , idx = classArray.indexOf('navbar-collapse');
    assert.equal(classArray.indexOf('navbar-collapse', idx+1), -1);
  });
});
