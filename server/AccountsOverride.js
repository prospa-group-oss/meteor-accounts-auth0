import { HttpHelper }   from '/imports/server/lib/httpHelper';
import { StatusCode }   from '/imports/lib/enums/statusCode.enum';

Accounts.registerLoginHandler( ( options ) => {


  let auth0Config     = Meteor.settings.auth0;
  let loginOptions   = _.extend( options.user, {
    'username':     options.user.email
  , 'grant_type':   auth0Config.passwordGrant
  , 'scope':        auth0Config.scope
  , 'connection':   auth0Config.connection
  , 'client_id':    auth0Config.clientId
  } );

  let user: any = Accounts.findUserByEmail( options.user.email );

  if ( user ) {
    userId = user._id
  }

  try {
    let params = {
        data: loginOptions
    };
    let url = auth0Config.baseUrl + auth0Config.login
    let result = HttpHelper.post( url, params );

    console.log('login', result);

    if ( result.statusCode === StatusCode.Ok ) {
      let data = {
        token:       result.data.id_token
      };

      Meteor.users.update( { _id: userId }, { $set: data } );

      return {
        userId: userId
      };
    }
  }
  catch ( e ) {
    console.error( 'accountsOverride - auth0 login error: ', e );
    throw new Meteor.Error(StatusCode.ServerError, 'Error occurred during login process' );
  }


} );

Accounts.onCreateUser( ( options, user ) => {
    if ( options.profile ) {
        user.profile = options.profile;
    }
    if ( options.emails ) {
        user.emails = options.emails;
    }

    return user;
});