TypeaheadInput = React.createClass({
  handleBlur: function(event) {
    Meteor.call("blockUpdate", this.props.id, {value: event.target.value});
    event.target.parentNode.innerHTML = event.target.value;
  },

  componentDidMount: function() {
    Meteor.typeahead.inject();
    document.getElementsByClassName("record-value")[1].addEventListener('blur', this.handleBlur);
    document.getElementsByClassName("record-value")[1].focus();
  },

  render() {
    return(
      <input className="record-value typeahead mousetrap"
        type="text"
        data-source="blocks"
        defaultValue={this.props.value} />
   );
  }
});
