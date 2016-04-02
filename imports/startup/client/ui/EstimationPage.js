import {composeWithTracker} from 'react-komposer';

import EstimationPage from './EstimationPage.jsx';

import { Estimations } from '../../../api/estimations.js';
import { Blocks } from '../../../api/blocks.js';

function composer(props, onData) {
  const estimations = Meteor.subscribe('estimations');
  const blocks = Meteor.subscribe('blocks', props._id);
  if(estimations.ready() && blocks.ready()) {
    const estimation = Estimations.findOne({_id: props._id});
    const blocks = Blocks.find({parentId: props._id}).fetch();
    const nonDepelopmentBlocks = Blocks.find({ estimationId: props._id, nonDevelopment: true}).fetch();
    onData(null, {estimation, blocks, nonDepelopmentBlocks});
  };
};

export default composeWithTracker(composer)(EstimationPage);
