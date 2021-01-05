import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  TextField,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const UpdateDetailsDialog = (props) => {
  const [open, toggleDialog] = useState(false);
  const [ticketDetails, setDetails] = useState(props.data);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    setDetails(props.data);
    setStatus(props.data.status);
    setType(props.data.type);
  }, [props.data]);

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={() => toggleDialog(true)}>
        Update Details
      </Button>
      <Dialog open={open} onClose={() => toggleDialog(false)}>
        <DialogContent>
          <form>
            <FormControl>
              <TextField
                label="Status"
                fullWidth
                onChange={(e) => setStatus(e.target.value)}
                value={status}
              />
            </FormControl>
            <FormControl>
              <TextField
                label="Type"
                fullWidth
                onChange={(e) => setType(e.target.value)}
                value={type}
              />
            </FormControl>
          </form>
          <p>Items: {JSON.stringify(ticketDetails.registereditemid)}</p>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined">Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

UpdateDetailsDialog.propTypes = {
  data: PropTypes.object,
};

export default UpdateDetailsDialog;
