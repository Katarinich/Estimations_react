import { Mongo } from 'meteor/mongo';

export const Users = Meteor.users;

if (Meteor.isServer) {
	Meteor.publish('estimationsUsers', function () {
		if(Roles.userIsInRole( this.userId, 'admin' )){
			return Meteor.users.find();
		}
		else {
		    return this.stop();
		}
	});
}

Meteor.methods({
	userVerify: function(userId) {
		if(Roles.userIsInRole( Meteor.userId(), 'admin' )){
			Roles.setUserRoles(userId, []);
			Roles.addUsersToRoles( userId, 'verifiedUser');
		}
		else console.log("Access denied.");
	},
	userReject: function(userId) {
		if(Roles.userIsInRole( Meteor.userId(), 'admin' )){
			Roles.setUserRoles(userId, []);
			Roles.addUsersToRoles( userId, 'rejectedUser');
		}
		else console.log("Access denied.");
	}
})
