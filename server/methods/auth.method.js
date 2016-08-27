import { HttpHelper }   from '/imports/server/lib/httpHelper';
import { StatusCode }   from '/imports/lib/enums/statusCode.enum';

Meteor.methods( {

  'auth.signUp': ( user ) => {

    const auth0Config   = Meteor.settings.auth0;
    const signUpOptions = _.extend( user, { connection: auth0Config.connection, client_id: auth0Config.clientId })

    let result;

    try {
      let params = {
        data: signUpOptions
      };
      let url = auth0Config.baseUrl + auth0Config.signUp;
      result  = HttpHelper.post( url , params );

      console.log( '[Auth0 signup] ', result);

    }
    catch (e) {

      console.error( 'auth.signUp - sign up error: ', e );
      throw new Meteor.Error( StatusCode.ServerError, 'Error while registering user' );
    }

    if ( result.statusCode !== StatusCode.Ok ) {

      console.error( 'auth.signUp - auth0 response error: ', result);
      throw new Meteor.Error( result.statusCode, 'Error while registering user' );
    }

    // Accounts.updateOrCreateUserFromExternalService
    // expects the unique user id to be stored in the 'id'
    // property of serviceData.
    var serviceData = {
      id: result.data._id
    };

    return Accounts.updateOrCreateUserFromExternalService( 'auth0', serviceData, {
      emails: [
        { address:  result.data.email
        , verified: result.data.email_verified
        }
      ]
    , profile: {} // add more profile info here
    } );

  }
} );