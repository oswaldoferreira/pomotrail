Members = new Meteor.Collection('members');
Tasks = new Meteor.Collection('tasks');

if (Meteor.isClient) {
  Pomodoro.initialize();

  Meteor.autorun(function () {
    var title = 'pomotrail'

    if(Pomodoro.status()) {
      title = Session.get('pomodoroTimer');
    }

    document.title = title;
  });

  Template.body.helpers({
    loggedInUser: function () {
      return Meteor.user();
    },

    tasks: function () {
      if( Meteor.user() ) {
        return Tasks.find(
          { userId: Meteor.user()._id }, { sort: {createdAt: -1 }
        });
      }
    },

    players: function () {
      return Tasks.find({status: { $in: ['working', 'paused', 'resting'] }});
    },

    hideCompleted: function () {
      return Session.get("hideCompleted");
    },

    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });

  Template.body.events({
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    },

    "submit .new-task": function (event) {
      var text = event.target.text.value;

      Tasks.insert({
        title:                text,
        createdAt:            new Date(),
        status:               'pending',
        interruptedPomodoros: 0,
        completedPomodoros:   0,
        userId:               Meteor.user()._id
      });

      event.target.text.value = "";

      return false;
    }
  });
}