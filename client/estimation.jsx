Estimation = React.createClass({
  propTypes: {
    estimation: React.PropTypes.object.isRequired
  },

  dateCreated() {
    var dateCreated = moment(this.props.estimation.dateCreated);
    return dateCreated.format("DD.MM.YYYY hh:mm:ss");
  },

  dateUpdated() {
    var dateCreated = moment(this.props.estimation.dateUpdated);
    return dateCreated.format("DD.MM.YYYY hh:mm:ss");
  },

  render() {
    const estimationLink = '/estimations/' + this.props.estimation._id;
    return (
      <li className="record-line">
        <a href={estimationLink}>{this.props.estimation.name} </a>{this.dateCreated()} {this.dateUpdated()}
    </li>
    );
  }
});
