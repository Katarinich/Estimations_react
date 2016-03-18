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
  },
  blockInsert: function(estimationId, parentId, index) {
    Blocks.find({
      parentId: parentId
    }).forEach(function(element) {
      if (element.index >= index) {
        Blocks.update({
          _id: element._id
        }, {
          $set: {
            index: element.index + 1
          }
        });
      }
    });

    var newBlock = {
      userId: Meteor.userId(),
      value: "",
      isParent: false,
      estimationId: estimationId,
      parentId: parentId,
      hours: "0",
      rate: 0.0,
      index: index
    };
    Blocks.insert(newBlock);

    Meteor.call('estimationUpdate', estimationId, {
      dateUpdated: new Date()
    });
  },
  blockRemove: function(blockId) {
    var blockToRemove = Blocks.findOne({
      _id: blockId
    });
    var parentBlock = Blocks.findOne({
      _id: blockToRemove.parentId
    });

    Blocks.find({
      parentId: parentBlock._id
    }).forEach(function(element) {
      if (element.index > blockToRemove.index) {
        Blocks.update({
          _id: element._id
        }, {
          $set: {
            index: element.index - 1
          }
        });
      }
    });

    if (blockToRemove.isParent) {
      Blocks.find({
        parentId: blockId
      }).forEach(function(element) {
        Blocks.remove({
          _id: element._id
        });
      });
    }

    Blocks.remove({
      _id: blockId
    });

    Meteor.call('estimationUpdate', blockToRemove.estimationId, {
      dateUpdated: new Date()
    });
  },
  blockDepose: function(blockId, direction) {
    var blockToDepose = Blocks.findOne({
      _id: blockId
    });
    var parentBlock = Blocks.findOne({
      _id: blockToDepose.parentId
    });
    var newParent;

    var previousBlock = Blocks.findOne({
      parentId: parentBlock._id,
      index: blockToDepose.index - 1
    });
    if (!(direction == 1 && blockToDepose.index == 0)) {
      var newIndex;
      if (direction == 1) {
        newIndex = -1;
        newParent = Blocks.findOne({
          parentId: parentBlock._id,
          index: blockToDepose.index - 1
        });
        Blocks.find({
          parentId: newParent._id
        }).forEach(function(element) {
          if (newIndex < element.index) {
            newIndex = element.index;
          }
        });
        newIndex = newIndex + 1;

      } else {
        newIndex = parentBlock.index + 1;
        newParent = Blocks.findOne({
          _id: parentBlock.parentId
        });
      }


      //меняем индексы блоков, входящие в текущий родительский
      Blocks.find({
        parentId: parentBlock._id
      }).forEach(function(element) {
        if (element.index > blockToDepose.index) {
          Blocks.update({
            _id: element._id
          }, {
            $set: {
              index: element.index - 1
            }
          });
        }
      });

      //меняем индексы блоков, входящие в новый родительский
      Blocks.find({
        parentId: newParent._id
      }).forEach(function(element) {
        if (element.index >= newIndex) {
          Blocks.update({
            _id: element._id
          }, {
            $set: {
              index: element.index + 1
            }
          });
        }
      });

      Meteor.call("blockUpdate", newParent._id, {
        isParent: true,
        hours: "",
        rate: 0
      });
      Meteor.call("blockUpdate", blockToDepose._id, {
        index: newIndex,
        parentId: newParent._id,
      });
    }
  }
});
