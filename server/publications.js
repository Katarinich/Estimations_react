Meteor.publish('blocks', function(estimationId) {
  return Blocks.find({estimationId: estimationId});
});

Meteor.publish('estimations', function() {
  return Estimations.find();
});

//var Typeahead = Meteor.npmRequire('react-typeahead').Typeahead;
