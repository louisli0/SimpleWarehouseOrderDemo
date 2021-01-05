import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const NonAssignedTable = (props) => {
  const history = useHistory();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios
      .get('/api/v1/ticket/', {
        params: {
          type: 'non-assigned',
        },
      })
      .then((res) => {
        setTickets(res.data);
      })
      .catch((err) => {
        if (err.response.status == 403) {
          history.push('/login');
        }
        console.log(err);
      });
  }, []);

  const handleTicketLink = (data) => {
    history.push(`/dashboard/tickets/${data}`);
  };

  return (
    <React.Fragment>
      <Typography variant="h6">Non-assigned</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Last Updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.length > 0 &&
            tickets.map((x, i) => {
              return (
                <TableRow key={i} hover onClick={() => handleTicketLink(x.id)}>
                  <TableCell>{x.status}</TableCell>
                  <TableCell>{x.type}</TableCell>
                  <TableCell>{new Date(x.lastupdated).toLocaleString('en-au')}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

export default NonAssignedTable;
