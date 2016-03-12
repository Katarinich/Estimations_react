FlowRouter.route('/estimations', {
  action() {
    ReactLayout.render(EstimationList);
  }
});

FlowRouter.route('/estimations/:_id', {
  subscriptions: function(params) {
    this.register('blocks', Meteor.subscribe('blocks', params._id));
  },
  action: function(params, queryParams) {
    ReactLayout.render(App);
  }
});
