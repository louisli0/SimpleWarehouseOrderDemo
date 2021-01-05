import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PublicLayout from '../Components/Layouts/PublicLayout/PublicLayout';
import TicketCreate from '../Pages/Public/Ticket/TicketCreate';
import TicketDetails from '../Pages/Public/Ticket/TicketDetails';
import ViewItems from '../Pages/Public/Item/ViewItems';
import UserTicketOverview from '../Pages/Public/Ticket/TicketOverview';
import RegisterItem from '../Pages/Public/Item/RegisterItem';
import PropTypes from 'prop-types';

const UserRoutes = ({ match }) => {
  const isLoggedIn = useSelector((state) => state.app.auth.isLoggedIn);
  if (isLoggedIn == false) {
    console.log('User Route not logged in');
    return <Redirect to="/login" />;
  }

  return (
    <Route path="/user">
      <PublicLayout>
        <Route path={`${match.url}/ticket`}>
          <Route path={`${match.url}/ticket/create`} component={TicketCreate} />
          <Route path={`${match.url}/ticket/:id`} component={TicketDetails} />
          <Route path={`${match.url}/ticket`} exact component={UserTicketOverview} />
        </Route>
        <Route path={`${match.url}/item`}>
          <Route path={`${match.url}/item/register`} component={RegisterItem} />
          <Route path={`${match.url}/item`} exact component={ViewItems} />
        </Route>
      </PublicLayout>
    </Route>
  );
};

UserRoutes.propTypes = {
  match: PropTypes.object,
};

export default UserRoutes;
