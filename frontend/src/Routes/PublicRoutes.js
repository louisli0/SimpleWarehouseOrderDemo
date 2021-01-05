import React from 'react';
import { Route } from 'react-router-dom';
import PublicIndex from '../Pages/Public/Index';
import About from '../Pages/Public/About';
import LoginPage from '../Components/Accounts/LoginPage';
import RegisterPage from '../Components/Accounts/RegisterPage';
import PublicLayout from '../Components/Layouts/PublicLayout/PublicLayout';
import PropTypes from 'prop-types';

const PublicRoutes = ({ match }) => {
  return (
    <div>
      <Route path="/">
        <PublicLayout>
          <Route path={`${match.url}login`} component={LoginPage} />
          <Route path={`${match.url}register`} component={RegisterPage} />

          <Route path={`${match.url}about`} component={About} />
          <Route path={`${match.url}`} exact component={PublicIndex} />
        </PublicLayout>
      </Route>
    </div>
  );
};
PublicRoutes.propTypes = {
  match: PropTypes.object,
};

export default PublicRoutes;
