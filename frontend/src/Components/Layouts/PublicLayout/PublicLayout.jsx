import React from 'react';
import Footer from './Footer';
import Header from './Header';
import PropTypes from 'prop-types';
import { makeStyles, Box } from '@material-ui/core';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    minHeight: '100vh',
  },
  content: {
    width: '100%',
    marginTop: '14px',
    display: 'flex',
    justifyContent: 'center',
    padding: '30px',
    paddingBottom: '250px',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#4C5454',
    color: '#FFFFFF',
    width: '100%',
    padding: '20px',
  },
}));

const PublicLayout = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.content}>{props.children}</div>
      <footer className={classes.footer}>
        <Footer />
      </footer>
    </div>
  );
};

PublicLayout.propTypes = {
  children: PropTypes.node,
};

const mapStateToProps = (App) => ({ App });
export default connect(mapStateToProps)(PublicLayout);
