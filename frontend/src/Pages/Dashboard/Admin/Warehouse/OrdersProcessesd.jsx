import React, { Component } from 'react';
import PropTypes from 'prop-types';

class OrdersProcessed extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(props) {
    console.log(this.props.match);
  }

  displayTable() {}
  render() {
    return <h1>Orders Processed here</h1>;
  }
}

OrdersProcessed.propTypes = {
  match: PropTypes.array,
};

export default OrdersProcessed;
