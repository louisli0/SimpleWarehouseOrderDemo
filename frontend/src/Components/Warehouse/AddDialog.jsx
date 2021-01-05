import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  FormControl,
  InputLabel,
  Input,
  DialogActions,
  withStyles,
} from '@material-ui/core';
import Axios from 'axios';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ShowMessage } from '../../Actions/actions';

const useStyles = {
  warehouse: {
    display: 'flex',
    flexDirection: 'column',
  },
};

class WarehouseAddDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      name: '',
    };
    this.toggleDialog = this.toggleDialog.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleName = this.handleName.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
  }

  handleAdd() {
    Axios.post('/api/v1/warehouse/', {
      name: this.state.name,
      userId: this.props.App.app.auth.uId,
    })
      .then((res) => {
        console.log(res);
        this.props.ShowMessage(`Created ${this.state.name}`);
        this.setState({ name: '', open: false });
      })
      .catch((err) => {
        console.log(err);
        this.props.ShowMessage(`Failed to create ${this.state.name}`);
      });
  }

  handleName(e) {
    this.setState({ name: e.target.value });
  }

  reset() {
    this.setState({ name: '' });
  }

  toggleDialog() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const classes = this.props;
    const { open, name } = this.state;
    return (
      <React.Fragment>
        <Button variant="outlined" color="primary" onClick={this.toggleDialog}>
          Add new
        </Button>
        <Dialog open={open} onClose={this.toggleDialog} maxWidth={'lg'}>
          <DialogTitle>Add new Warehouse</DialogTitle>
          <DialogContent>
            <div className={classes.warehouse}>
              <FormControl>
                <InputLabel htmlFor="name">Name</InputLabel>
                <Input id="name" onChange={this.handleName} value={name} />
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="secondary" onClick={this.reset}>
              Reset
            </Button>
            <Button onClick={this.handleAdd}>Add</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

WarehouseAddDialog.propTypes = {
  warehouse: PropTypes.object,
  ShowMessage: PropTypes.func,
  App: PropTypes.object,
};

const MapStateToProps = (App) => ({ App });
export default connect(MapStateToProps, { ShowMessage })(withStyles(useStyles)(WarehouseAddDialog));
