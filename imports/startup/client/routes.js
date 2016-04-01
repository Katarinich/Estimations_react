import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import EstimationsList from '../../ui/EstimationsList.jsx';

FlowRouter.route('/estimations', {
  name: 'Estimations',
  action() {
    mount(EstimationsList);
  },
});
