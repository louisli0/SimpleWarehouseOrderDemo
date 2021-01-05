import {
  Card,
  CardContent,
  Table,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Typography,
  makeStyles,
  TextField,
  FormControl,
  Button,
} from '@material-ui/core';
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: '20px',
  },
}));
const TicketSearch = (props) => {
  const [tickets, setTickets] = useState([]);
  const uID = useSelector((state) => state.app.auth.uId);
  const history = useHistory();
  const classes = useStyles();
  const [searchTerm, setSearch] = useState('');

  const search = (data) => {
    axios
      .get('/api/v1/ticket/', {
        params: {
          search: searchTerm,
          uId: uID,
        },
      })
      .then((res) => {
        console.log(res);
        setTickets(res.data.details);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTicket = (data) => {
    history.push(`/dashboard/tickets/${data}`);
  };

  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6">Search</Typography>
          <FormControl>
            <TextField
              label="Ticket ID"
              onChange={(e) => setSearch(e.target.value)}
              value={searchTerm}
            />
          </FormControl>
          <Button variant="outlined" onClick={() => search()}>
            Search
          </Button>
        </CardContent>
      </Card>

      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6">Results</Typography>
          {tickets.length == 0 && <Typography variant="h5">No Results</Typography>}
          {tickets.status != undefined && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover onClick={() => handleTicket(tickets.id)}>
                  <TableCell>{tickets.status}</TableCell>
                  <TableCell>{new Date(tickets.lastupdated).toLocaleString('en-au')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default TicketSearch;
