Blocks = new Mongo.Collection("blocks");

Meteor.methods({
  blockUpdate: function(blockId, updates) {
    var currentBlock = Blocks.findOne({
      _id: blockId
    });

    if (updates.hasOwnProperty("hours")) {
      if (!isNaN(updates.hours.charAt(updates.hours.length - 1))) {
        updates.hours += "h";
      }
    }

    Blocks.update({
      _id: blockId
    }, {
      $set: updates
    });
  }
});
