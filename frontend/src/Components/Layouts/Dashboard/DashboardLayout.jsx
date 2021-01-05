import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  makeStyles,
  Drawer,
  List,
  ListItem,
  Hidden,
  ListItemText,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListAltIcon from '@material-ui/icons/ListAlt';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import './styles/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../../../Actions/actions';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  Root: {
    marginTop: '70px',
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    zIndex: 1,
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuToggle: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  noDecoration: {
    textDecoration: 'none',
    color: 'inherit',
  },
  content: {
    [theme.breakpoints.up('lg')]: {
      width: 'calc(100-% - ${drawerWidth}px)',
      marginLeft: drawerWidth,
    },
    marginTop: theme.spacing(3),
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const DashboardLayout = (props) => {
  const [open, toggleMenu] = useState(false);
  const [open2, toggleSubMenu] = useState(null);
  const classes = useStyles();
  const name = useSelector((state) => state.app.user.firstName);
  const name2 = useSelector((state) => state.app.user.lastName);
  const fullName = name + ' ' + name2;
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(Logout());
  };
  const drawerContent = (
    <div>
      <div className={classes.toolbar}></div>
      <Divider />
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText>Overview</ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/dashboard/tickets">
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText>Tickets</ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/dashboard/item">
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <ListItemText>Item</ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/dashboard/warehouse">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>Warehouse</ListItemText>
        </ListItem>
      </List>
    </div>
  );

  return (
    <React.Fragment>
      <div className={classes.Root}>
        <div className={classes.drawer}>
          <Hidden mdUp implementation="css">
            <Drawer
              open={open}
              variant="temporary"
              onClose={() => toggleMenu(false)}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <List>{drawerContent}</List>
            </Drawer>
          </Hidden>
          <Hidden mdDown implementation="css">
            <Drawer
              open
              variant="permanent"
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawerContent}
            </Drawer>
          </Hidden>
        </div>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              className={classes.menuToggle}
              color="inherit"
              edge="start"
              onClick={() => toggleMenu(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h4">
              <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                Dispatch
              </Link>
            </Typography>
            <div className="Spacer"></div>
            {/* account menu */}
            <Menu open={Boolean(open2)} anchorEl={open2} onClose={() => toggleSubMenu(false)}>
              <MenuItem>Overview</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>
                <Button onClick={() => handleLogout()}>Logout</Button>
              </MenuItem>
            </Menu>
            <Button onClick={(e) => toggleSubMenu(e.currentTarget)}>{fullName}</Button>
          </Toolbar>
        </AppBar>
      </div>

      <div className={classes.content}>{props.children}</div>
    </React.Fragment>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export default DashboardLayout;
