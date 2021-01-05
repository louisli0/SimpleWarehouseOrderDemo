import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AssignedTable = () => {
  const [tickets, setTickets] = useState([]);
  const history = useHistory();
  const uId = useSelector((state) => state.app.auth.uId);

  useEffect(() => {
    Axios.get('/api/v1/ticket/', {
      params: {
        uId: uId,
        type: 'assigned',
      },
    })
      .then((result) => {
        setTickets(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleTicketLink = (data) => {
    history.push(`/dashboard/tickets/${data}`);
  };

  return (
    <React.Fragment>
      <Typography variant="h6">Assigned Tickets</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.length == 0 && (
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  No Tickets
                </TableCell>
              </TableRow>
            )}

            {tickets.length > 0 &&
              tickets.map((x) => {
                return (
                  <TableRow key={x.id} hover onClick={() => handleTicketLink(x.id)}>
                    <TableCell>{x.status}</TableCell>
                    <TableCell>{x.type}</TableCell>
                    <TableCell>{new Date(x.lastupdated).toLocaleString('en-au')}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default AssignedTable;
