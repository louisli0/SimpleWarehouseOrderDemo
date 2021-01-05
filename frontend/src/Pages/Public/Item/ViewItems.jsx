import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button,
  Grid,
} from '@material-ui/core';
import axios from 'axios';
import PropTypes from 'prop-types';

class ViewItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      type: '',
      regItems: [],
    };
    this.handleDescription = this.handleDescription.bind(this);
    this.handleType = this.handleType.bind(this);
    this.itemId = this.handleItemId.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    console.log(this.props.App.app.auth.uId);
    const at = this.props.App.app.auth.accessToken;
    const uID = this.props.App.app.auth.uId;

    axios
      .get('http://localhost:3200/api/v1/item/registered', {
        params: {
          uID: uID,
        },
      })
      .then((res) => {
        console.log('items array', res);
        this.setState({ regItems: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleDescription(e) {
    this.setState({ description: e.target.value });
  }

  handleType(e) {
    this.setState({ type: e.target.value });
  }

  handleItemId(e) {
    this.setState({ itemId: e.target.value });
  }

  handleSubmit() {
    axios
      .post('/api/v1/ticket/', { data: this.state })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    const { regItems } = this.state;
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5">Items</Typography>
                <Button variant="outlined">
                  <Link
                    to="/user/item/register"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    Register New Item
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Registered</Typography>
                {
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Item Name</TableCell>
                        <TableCell>Serial</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {regItems.length > 0 &&
                        regItems.map((x, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{x.name}</TableCell>
                              <TableCell>{x.serialnumber}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                }
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

ViewItems.propTypes = {
  App: PropTypes.object,
  app: PropTypes.object,
  auth: PropTypes.object,
  uId: PropTypes.number,
};
const mapStateToProps = (App) => ({ App });
export default connect(mapStateToProps, {})(ViewItems);
