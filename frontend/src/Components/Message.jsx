import { Icon, IconButton, Snackbar } from '@material-ui/core';
import React, { Component } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import { ClearMessage } from '../Actions/actions';

const Message = (props) => {
  const { message, open } = useSelector((state) => state.msg);
  const dispatch = useDispatch();

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={4000}
      onClose={() => dispatch(ClearMessage())}
      message={message}
      action={[
        <IconButton key="close" onClick={() => dispatch(ClearMessage())}>
          <CloseIcon />
        </IconButton>,
      ]}
    />
  );
};

export default Message;
