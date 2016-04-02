import {composeWithTracker} from 'react-komposer';

import AdminPage from './AdminPage.jsx';

import { Users } from '../../../api/estimationsUsers.js';

function composer(props, onData) {
  const users = Meteor.subscribe('estimationsUsers');
  onData(null, {users});
};

export default composeWithTracker(composer)(AdminPage);
