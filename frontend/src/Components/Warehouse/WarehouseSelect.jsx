import {
  Button,
  makeStyles,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  warehouse: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const WarehouseSelect = () => {
  const [warehouseList, setWarehouse] = useState([]);
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    Axios.get('http://localhost:3200/api/v1/warehouse')
      .then((result) => {
        setWarehouse(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleRowClick = (id) => {
    history.push(`/dashboard/warehouse/${id}`);
  };

  function displaySelect() {
    if (typeof warehouseList === undefined) {
      return <p>No Data</p>;
    } else if (typeof warehouseList === 'object') {
      return (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {warehouseList.map((x) => {
                return (
                  <React.Fragment key={x.id}>
                    <TableRow key={x.id} onClick={() => handleRowClick(x.id)}>
                      <TableCell>{x.name}</TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  }

  return <React.Fragment>{displaySelect()}</React.Fragment>;
};

export default WarehouseSelect;
