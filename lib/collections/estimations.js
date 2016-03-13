Estimations = new Mongo.Collection('estimations');

Meteor.methods({
  estimationInsert: function() {
    var newEstimation = {
      name: "new list",
      clientName: "new client",
      dateCreated: new Date(),
      dateUpdated: new Date(),
      developmentTotalSum: 0,
      developmentTotalHours: 0,
      nonDevelopmentTotalSum: 0,
      nonDevelopmentTotalHours: 0
    };

    var newEstimationId = Estimations.insert(newEstimation);

    var baseBlock = {
        index: 0,
        isParent: true,
        value: "Development Activities",
        estimationId: newEstimationId,
        parentId: newEstimationId
    };

    var baseBlockId = Blocks.insert(baseBlock);

    var firstBlock = {
        index: 0,
        value: "",
        hours: "0",
        rate: 0.0,
        estimationId: newEstimationId,
        parentId: baseBlockId
    };
    Blocks.insert(firstBlock);
  },
  estimationUpdate: function(estimationId, updates){
        updates.dateUpdated = new Date();
        Estimations.update({
            _id: estimationId
        },
        {
            $set: updates
        });
    }
});
