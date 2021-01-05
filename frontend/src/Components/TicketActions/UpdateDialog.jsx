import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  text: {
    marginBottom: '25px',
    width: '250px',
  },
}));

const UpdateDialog = (props) => {
  const classes = useStyles();
  const [open, toggleDialog] = useState(false);
  const [description, handleDescription] = useState('');

  const handleSubmit = () => {
    props.updateData(description);
  };
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={() => toggleDialog(true)}>
        Update
      </Button>
      <Dialog open={open} onClose={() => toggleDialog(false)}>
        <DialogTitle>Add Activity</DialogTitle>
        <DialogContent>
          <TextField
            className={classes.text}
            label="Description"
            variant="outlined"
            multiline
            fullWidth
            rows={20}
            onChange={(e) => handleDescription(e.target.value)}
            value={description}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleSubmit()}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

UpdateDialog.propTypes = {
  updateData: PropTypes.func,
};

export default UpdateDialog;
