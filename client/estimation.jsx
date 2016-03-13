Estimation = React.createClass({
  propTypes: {
    estimation: React.PropTypes.object.isRequired
  },

  render() {
    const estimationLink = '/estimations/' + this.props.estimation._id;
    var dateCreated = moment(this.props.estimation.dateUpdated).format("DD.MM.YYYY hh:mm:ss");
    var dateUpdated = moment(this.props.estimation.dateUpdated).format("DD.MM.YYYY hh:mm:ss");
    return (
      <li className="record-line">
        <a href={estimationLink}>{this.props.estimation.name} </a>{dateCreated} {dateUpdated}
    </li>
    );
  }
});
