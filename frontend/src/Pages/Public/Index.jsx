import React from 'react';
import { Box } from '@material-ui/core';
import { Link } from 'react-router-dom';

const PublicIndex = () => {
  return (
    <React.Fragment>
      <ul>
        <li>
          <Link to="/user/ticket">Ticket</Link>
        </li>
        <li>
          <Link to="/user/item">Items</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </React.Fragment>
  );
};

export default PublicIndex;
