export var HttpHelper = {};

var call = Meteor.wrapAsync( ( method, url, options, resolve ) => {

  var ops = HttpHelper.constructRequest( options );

  HTTP.call( method, url, ops, ( err, result ) => {
    if ( err ) {
      resolve( null, err.response );
    } else {
      resolve( null, result );
    }
  } );
} );

/*
 * appends content-type and authorization to header
 */
HttpHelper.constructRequest = ( options ) => {

  var headers
  ,    user
  ,    result;
  ;
  headers = { 'content-type': 'application/json' };
  user     = Meteor.user();
  options = options || {};

  if ( user ) {
    headers.Authorization = 'Bearer ' + user.token;
  }
  if ( options.headers ) {
    headers = _.extend( headers, options.headers );
  }
  return _.extend( options, { headers: headers } );

}

HttpHelper.post = ( url, options ) => {
  options = options || {};
  return call('POST', url, options);
}

HttpHelper.put = ( url, options ) => {
  options = options || {};
  return call('PUT', url, options);
}

HttpHelper.get = ( url, options ) => {
  options = options || {};
  return call('GET', url, options );
}

HttpHelper['delete'] = ( url, options ) => {
  options = options || {};
  return call('DELETE', url, options );
}
