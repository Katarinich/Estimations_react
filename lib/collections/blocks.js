Blocks = new Mongo.Collection("blocks");

Meteor.methods({
  blockUpdate: function(blockId, updates) {
    var currentBlock = Blocks.findOne({
      _id: blockId
    });

    Blocks.update({
      _id: blockId
    }, {
      $set: updates
    });
  }
});
