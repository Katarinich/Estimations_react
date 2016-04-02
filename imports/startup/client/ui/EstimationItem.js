import {composeWithTracker} from 'react-komposer';

import EstimationItem from './EstimationItem.jsx';

import { Blocks } from '../../../api/blocks.js';

function composer(props, onData) {
  console.log(Blocks.find().fetch());
  console.log(props);
  const childrenBlocks = Blocks.find({parentId: props.block._id}, {sort: {index: 1}}).fetch();
  onData(null, {childrenBlocks});
};

export default composeWithTracker(composer)(EstimationItem);
