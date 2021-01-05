import {
  Card,
  Box,
  CardContent,
  makeStyles,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  IconButton,
  Collapse,
  Paper,
  List,
  ListItem,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useSelector } from 'react-redux';
import UpdateDialog from '../../../../Components/TicketActions/UpdateDialog';
import UpdateDetailsDialog from '../../../../Components/TicketActions/UpdateDetailsDialog';
import CreateWHGOrderDialog from '../../../../Components/TicketActions/CreateWHOrderDialog';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: '10px',
  },
  paper: {
    padding: '10px',
    margin: '10px',
  },
}));

const AdminTicketDetails = ({ match }) => {
  const classes = useStyles();
  const [ticketActivity, setActivity] = useState([]);
  const [ticketDetails, setDetails] = useState([]);
  const [ticketItems, setItem] = useState([]);
  const [open, setOpen] = useState(false);
  const ticketId = match.params.id;
  const uId = useSelector((state) => state.app.auth.uId);

  useEffect(() => {
    // Get Ticket Details and Activty
    axios
      .get(`/api/v1/ticket/${ticketId}`)
      .then((res) => {
        console.log(res.data);
        setActivity(res.data.activity);
        setDetails(res.data.details[0]);
        setItem(res.data.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const updateTicket = (data) => {
    console.log('Dialog Description0', data);
    axios
      .post(`/api/v1/ticket/${ticketId}/activity`, {
        ticketId: ticketId,
        userId: uId,
        description: data,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5">Actions</Typography>
          <CreateWHGOrderDialog data={ticketItems} id={ticketDetails.id} />
        </CardContent>
      </Card>

      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5">
            Ticket Details
            <span>
              <UpdateDetailsDialog data={ticketDetails} />
            </span>
          </Typography>
          <p>Last Update: {new Date(ticketDetails.lastupdated).toLocaleString('en-au')}</p>
          <p>Status: {ticketDetails.status}</p>
          <p>Type: {ticketDetails.type}</p>
          <p>
            Items: <br />
            <List>
              {ticketItems.length > 0 &&
                ticketItems.map((x, i) => {
                  return <p key={i}>{x.name}</p>;
                })}
            </List>
          </p>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6">
            Activity{' '}
            <span>
              <UpdateDialog updateData={updateTicket} />
            </span>
          </Typography>
          {ticketActivity.length > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Date</TableCell>
                  <TableCell>By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ticketActivity.map((x, i) => {
                  return (
                    <>
                      <TableRow key={x.createdat} hover onClick={() => setOpen(!open)}>
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                          >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{new Date(x.createdat).toLocaleString('en-au')}</TableCell>
                        <TableCell>{x.createdby}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                          <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                              <Paper className={classes.paper}>{x.description}</Paper>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

AdminTicketDetails.propTypes = {
  match: PropTypes.object,
};

export default AdminTicketDetails;
