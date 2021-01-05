import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { Card, CardContent, Typography, withStyles } from '@material-ui/core';
import AddItemSerial from './AddItemSerial';

const styles = {
  card: {
    marginBottom: '20px',
  },
};

class ItemDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      itemData: [],
      inventoryList: [],
      quantityCount: 0,
    };
  }

  componentDidMount() {
    const { id } = this.state;

    axios
      .get(`/api/v1/item/${id}`, {})
      .then((result) => {
        console.log('item data', result.data);
        this.setState({ itemData: result.data });
      })
      .catch((err) => {
        console.log('inventory warehouse', err);
      });

    // Get Inventory Data
    axios
      .get(`/api/v1/inventory/item/${id}`)
      .then((res) => {
        console.log('inventory data', res.data);
        //Quantity Count
        let tempTotal = 0;
        res.data.forEach((x) => {
          tempTotal += x.quantity;
        });

        this.setState({ inventoryList: res.data, quantityCount: tempTotal });
      })
      .catch((err) => {
        if (err.response.status == 403) {
          this.props.history.push('/login');
        }
        console.log('Inventory', err);
      });
  }

  render() {
    const { inventoryList, itemData, quantityCount, id } = this.state;
    const { classes } = this.props;
    return (
      <React.Fragment>
        {itemData && (
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5">Item Details</Typography>
              <p>Name: {itemData.name}</p>
              <p>Category: {itemData.category}</p>
              <p>Description: {itemData.description}</p>
            </CardContent>
          </Card>
        )}

        {inventoryList && (
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5">Inventory</Typography>
              <p>There are {quantityCount} units </p>
              {inventoryList.map((x) => {
                return <p key={x.id}>{x.name}</p>;
              })}
            </CardContent>
          </Card>
        )}

        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h5">Serial Item</Typography>
            <AddItemSerial itemId={itemData.id} />
          </CardContent>
        </Card>
      </React.Fragment>
    );
  }
}

ItemDetails.propTypes = {
  match: PropTypes.object,
  App: PropTypes.object,
  classes: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = (App) => ({ App });
export default connect(mapStateToProps, {})(withStyles(styles)(ItemDetails));
