FlowRouter.route('/estimations', {
  triggersEnter: [checkLoggedIn],
  action() {
    Meteor.subscribe('estimations', Meteor.userId());
    ReactLayout.render(EstimationList);
  }
});

FlowRouter.route('/estimations/:_id', {
  subscriptions: function(params, queryParams) {
    this.register('blocks', Meteor.subscribe('blocksByEstimation', params._id));
    this.register('estimation', Meteor.subscribe('estimation', params._id));
  },
  action: function(params, queryParams) {
    ReactLayout.render(EstimationPage, {
      id: params._id
    });
  }
});

FlowRouter.route('/', {
  triggersEnter: [redirectIfLoggedIn],
  action: function () {
    ReactLayout.render(LoginPage);
  }
});

function checkLoggedIn (ctx, redirect) {
  if (!Meteor.userId()) {
    redirect('/')
  }
}

function redirectIfLoggedIn (ctx, redirect) {
  if (Meteor.userId()) {
    redirect('/estimations')
  }
}
