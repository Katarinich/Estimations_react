App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      blocks: Blocks.find().fetch()
    }
  },

  renderBlocks() {
    return this.data.blocks.map((block) => {
      return <Block key={block._id} block={block} />;
    });
  },

  render() {
    return (
      <div className="container">
        <ul id="records">
          {this.renderBlocks()}
        </ul>
      </div>
    );
  }
});
