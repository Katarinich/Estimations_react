Meteor.startup(function () {
  Meteor.subscribe("blocks");
  React.render(<App />, document.getElementById("container"));
});
