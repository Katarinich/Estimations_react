FlowRouter.route('/estimations', {
  action() {
    ReactLayout.render(EstimationList);
  }
});

FlowRouter.route('/estimations/:_id', {
  subscriptions: function(params) {
    this.register('blocks', Meteor.subscribe('blocks', params._id));
    this.register('estimation', Meteor.subscribe('estimation', params._id));
  },
  action: function(params, queryParams) {
    ReactLayout.render(EstimationPage, {
      id: params._id
    });
  }
});

FlowRouter.route('/', {
  action: function() {
    if (!Meteor.user()) ReactLayout.render(LoginPage);
    else FlowRouter.go('/estimations');
  }
})
