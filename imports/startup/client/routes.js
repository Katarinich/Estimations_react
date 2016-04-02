import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import { Estimations } from '../../api/estimations.js';

import EstimationsList from '../client/ui/EstimationsList.jsx';
import EstimationPage from '../client/ui/EstimationPage.js';
import AdminPage from '../client/ui/AdminPage.js';
import LoginPage from '../client/ui/LoginPage.jsx';

FlowRouter.route('/estimations', {
  name: 'Estimations',
  action() {
    mount(EstimationsList);
  },
});

FlowRouter.route('/estimations/:_id', {
  name: 'Estimations',
  action(params, queryParams) {
    mount(EstimationPage, {_id: params._id});
  },
});

FlowRouter.route('/', {
  triggersEnter: [redirectIfLoggedIn],
  action(params, queryParams) {
    console.log(Meteor.userId());
    console.log(Roles.userIsInRole( Meteor.userId(), 'admin' ));
    if(Roles.userIsInRole( Meteor.userId(), 'admin' )) {
      mount(AdminPage);
    }
    else mount(LoginPage);
  },
});

function redirectIfLoggedIn (ctx, redirect) {
  if (Roles.userIsInRole( Meteor.userId(), 'verifiedUser' )) {
    redirect('/estimations')
  }
}
