import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardLayout from '../Components/Layouts/Dashboard/DashboardLayout';
import TicketSearch from '../Pages/Dashboard/Admin/Tickets/TicketSearch';
import WarehouseDetails from '../Pages/Dashboard/Admin/Warehouse/WarehouseDetails';
import OrdersProcessed from '../Pages/Dashboard/Admin/Warehouse/OrdersProcessesd';
import DashboardOverview from '../Pages/Dashboard/Admin/DashboardOverview';
import ItemsOverview from '../Pages/Dashboard/Admin/Items/ItemsOverview';
import WarehouseOverview from '../Pages/Dashboard/Admin/Warehouse/WarehouseOverview';
import AdminTicketDetails from '../Pages/Dashboard/Admin/Tickets/AdminTicketDetails';
import ItemDetails from '../Components/Item/ItemDetails';
import AddItem from '../Components/Item/AddItem';
import PropTypes from 'prop-types';
import WarehouseInventory from '../Pages/Dashboard/Admin/Warehouse/WarehouseInventory';

const Dashboard = ({ match }) => {
  // Get Logged in state
  const isLoggedIn = useSelector((state) => state.app.auth.isLoggedIn);
  if (isLoggedIn == false) {
    console.log('Login');
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <Route path="/dashboard">
        <DashboardLayout>
          <Route exact path={`${match.url}`} component={DashboardOverview} />

          <Route path={`${match.url}/tickets`}>
            <Route path={`${match.url}/tickets/:id`} component={AdminTicketDetails} />
            <Route path={`${match.url}/tickets`} exact component={TicketSearch} />
          </Route>

          <Route path={`${match.url}/warehouse`}>
            <Route path={`${match.url}/warehouse/:id/inventory`} component={WarehouseInventory} />
            <Route path={`${match.url}/warehouse/:id/orders`} component={OrdersProcessed} />
            <Route path={`${match.url}/warehouse/:id`} exact component={WarehouseDetails} />

            <Route path={`${match.url}/warehouse/`} exact component={WarehouseOverview} />
          </Route>

          <Route path={`${match.url}/item`}>
            <Route path={`${match.url}/item/:id`} component={ItemDetails} />
            <Route path={`${match.url}/item/new`} component={AddItem} />
            <Route path={`${match.url}/item`} exact component={ItemsOverview} />
          </Route>
        </DashboardLayout>
      </Route>
    </div>
  );
};
Dashboard.propTypes = {
  match: PropTypes.object,
};

export default Dashboard;
