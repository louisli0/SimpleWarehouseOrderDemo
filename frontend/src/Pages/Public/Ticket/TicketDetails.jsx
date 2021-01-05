import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Card,
  Collapse,
  Box,
  Paper,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  List,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import axios from 'axios';
import UpdateDialog from '../../../Components/TicketActions/UpdateDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '860px',
  },
  card: {
    marginBottom: '10px',
  },
  paper: {
    padding: '10px',
    margin: '10px',
  },
}));

const TicketDetails = (props) => {
  const classes = useStyles();

  const ticketId = props.match.params.id;
  const uId = useSelector((state) => state.app.auth.uId);
  const [activity, setActivity] = useState([]);
  const [details, setDetails] = useState([]);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/v1/ticket/${ticketId}`)
      .then((res) => {
        console.log(res.data);
        setActivity(res.data.activity);
        setDetails(res.data.details[0]);
        setItems(res.data.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const updateTicket = (data) => {
    console.log('Dialog Description', data);
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
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h5">Ticket Details</Typography>
            <p>Last Update: {new Date(details.lastupdated).toLocaleString('en-au')}</p>
            <p>Status: {details.status}</p>
            <p>Type: {details.type}</p>
            <p>
              Items: <br />
              <List>
                {items.length > 0 &&
                  items.map((x, i) => {
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
            {activity.length > 0 && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Date</TableCell>
                    <TableCell>By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activity.map((x, i) => {
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
      </div>
    </React.Fragment>
  );
};

TicketDetails.propTypes = {
  match: PropTypes.object,
};

export default TicketDetails;
