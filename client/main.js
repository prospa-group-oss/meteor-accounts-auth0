import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.main.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.login = new ReactiveVar(true);
});

Template.main.helpers({
  stateLogin() {

    return Template.instance().login.get();
  }
, loggedIn() {
    return Meteor.userId();
  }
});


Template.main.events( {

  'click #login button'( event, instance ) {

    let user = {
      email:      $( '[name="email"]' ).val()
    , password:   $( '[name="password"]' ).val()
    };

    Accounts.callLoginMethod( {
      methodArguments: [ {
        user: user
      } ]
    , userCallback: ( error ) => {

        if ( error ) {
          console.error( 'Error', error );
        }
        else {
          // do some happy stuff
          console.log( 'Logged in!' );
        }
      }
    });
  }
, 'click #register button'(event, instance) {

    let user = {
      email:      $( '[name="email"]' ).val()
    , password:   $( '[name="password"]' ).val()
    };

    Meteor.call( 'auth.signUp', user, ( error, result ) => {

      if ( error ) {
        console.error( error );
      }

      console.log('>', result);

      Accounts.callLoginMethod( {

        methodArguments:  [ { user: user } ]
      , userCallback:     ( error ) => {

          if ( error ) {
            console.log( 'Not logged in');
          }
          else {
            console.log( 'Logged in' );
          }
        }
      });

    } );
  }

, 'click #logout button'( event, instance ) {

    Meteor.logout( () => {
      instance.login.set( true );
    });
  }

, 'click #login [role=goRegister]'(event, instance) {

    instance.login.set( false );
  }
, 'click #register [role=goLogin]'(event, instance) {

    instance.login.set( true );
  }
});