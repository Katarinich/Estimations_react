import { Mongo } from 'meteor/mongo';

import { Blocks } from '../api/blocks.js';

export const Estimations = new Mongo.Collection('estimations');

if (Meteor.isServer) {
  Meteor.publish('estimations', function estimationsPublication() {
    return Estimations.find();
  });
}

Meteor.methods({
  estimationInsert: function() {
    var newEstimation = {
      userId: this.userId,
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
      userId: this.userId,
      index: 0,
      isParent: true,
      value: "Development Activities",
      estimationId: newEstimationId,
      parentId: newEstimationId
    };

    var baseBlockId = Blocks.insert(baseBlock);

    var firstBlock = {
      userId: this.userId,
      index: 0,
      value: "",
      hours: "0",
      rate: 0.0,
      estimationId: newEstimationId,
      parentId: baseBlockId
    };
    Blocks.insert(firstBlock);

    var testingBlock = {
      userId: this.userId,
      estimationId: newEstimationId,
      nonDevelopment: true,
      text: "Testing",
      percent: "30%",
      rate: 0,
      checked: true
    }
    Blocks.insert(testingBlock);

    var stabilizationBlock = {
      userId: this.userId,
      estimationId: newEstimationId,
      nonDevelopment: true,
      text: "Stabilization",
      percent: "20%",
      rate: 0,
      checked: true
    }
    Blocks.insert(stabilizationBlock);

    var projectManagmentBlock = {
      userId: this.userId,
      estimationId: newEstimationId,
      nonDevelopment: true,
      text: "Project Managment",
      percent: "15%",
      rate: 0,
      checked: true
    }
    Blocks.insert(projectManagmentBlock);
  },
  estimationUpdate: function(estimationId, updates){
        updates.dateUpdated = new Date();
        Estimations.update({
            _id: estimationId
        },
        {
            $set: updates
        });
    },
    estimationRemove: function(estimationId){
      	Estimations.remove({_id: estimationId});
        Blocks.find({estimationId: estimationId}).forEach(function(element) {
            Blocks.remove({_id: element._id});
        })
    },
});
