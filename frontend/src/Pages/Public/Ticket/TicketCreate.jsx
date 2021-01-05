import React, { Component } from 'react';
import axios from 'axios';
import {
  Button,
  FormControl,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Paper,
  withStyles,
  FormLabel,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddItemDialog from '../../../Components/Item/AddItemDialog';

const styles = (theme) => ({
  title: {
    paddingBottom: '20px',
  },
  paper: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '500px',
  },
  formControl: {
    width: '100%',
    paddingBottom: '30px',
  },
});

class TicketCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      type: '',
      items: [],
    };
    this.handleDescription = this.handleDescription.bind(this);
    this.handleType = this.handleType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setItems = this.setItems.bind(this);
  }

  componentDidMount() {
    const { items, type } = this.state;
    const { uId } = this.props.App.app.auth;
    if (items && type && uId) {
      axios
        .get('/api/v1/items/registered', {
          items: items,
          type: type,
          userId: uId,
        })
        .then((result) => {
          console.log('Registered Items');
          this.setState({ items: result.data });
        })
        .catch((err) => {
          console.log('Registered Items Error', err);
        });
    }
  }

  handleDescription(e) {
    this.setState({ description: e.target.value });
  }

  handleType(e) {
    this.setState({ type: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const data = {
      items: this.state.items,
      type: this.state.type,
      userId: this.props.App.app.auth.uId,
      description: this.state.description,
    };

    axios
      .post('/api/v1/ticket/', data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  setItems(e) {
    console.log('Items from dialog', e);
    this.setState({ items: e });
  }

  render() {
    const { description, itemId, type, items } = this.state;
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Box>
          <Paper elevation={2} className={classes.paper}>
            <Typography variant="h4" className={classes.title}>
              New Ticket Order
            </Typography>
            <form>
              <FormControl className={classes.formControl}>
                <InputLabel id="ticketType">Ticket Type</InputLabel>
                <Select
                  fullWidth
                  labelId="ticketType"
                  value={type}
                  onChange={(e) => this.handleType(e)}
                >
                  <MenuItem value={'Replace'}>Replace</MenuItem>
                  <MenuItem value={'Sample'}>Sample Request</MenuItem>
                  <MenuItem value={'New'}>New</MenuItem>
                </Select>
              </FormControl>
              <AddItemDialog updateItems={this.setItems} />

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Serial</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length == 0 && (
                    <TableRow>
                      <TableCell rowSpan={2}>No Items Selected</TableCell>
                    </TableRow>
                  )}

                  {items.length > 0 &&
                    items.map((x, i) => {
                      return (
                        <TableRow key={x.id}>
                          <TableCell>{x.name}</TableCell>
                          <TableCell>{x.serialnumber}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>

              <FormControl className={classes.formControl}>
                <TextField
                  variant="outlined"
                  fullWidth
                  multiline
                  rowsMax={5}
                  value={description}
                  onChange={(e) => this.handleDescription(e)}
                  placeholder="Description"
                />
              </FormControl>
            </form>
            <p>TODO: Attachments</p>
            <Divider />
            <Button variant="outlined" onClick={this.handleSubmit}>
              Submit
            </Button>
          </Paper>
        </Box>
      </React.Fragment>
    );
  }
}

TicketCreate.propTypes = {
  classes: PropTypes.object,
  App: PropTypes.object,
  state: PropTypes.object,
  uId: PropTypes.number,
};

const mapStateToProps = (App) => ({ App });

export default connect(mapStateToProps, {})(withStyles(styles)(TicketCreate));
