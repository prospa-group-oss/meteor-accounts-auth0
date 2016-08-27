**Implementing Auth0 with Accounts package for MeteorJS**
--------------------------------------------

## Summary
This example app will demonstrate how to combine Auth0's single sign-on service with the Accounts package of MeteorJS.
When you register a user, a Mongo user will be created next to a user in Auth0. A JWT token will be returned which you can use in all your following requests.

The example uses just the Meteor starter project with Blaze only. However, you can easily use it in an Angular project.
We have tested this with Meteor 1.3 and Meteor 1.4.1.

**Handy resources**
https://jwt.io/
https://auth0.com/
https://robomongo.org/

Step 1: Create an Auth0 account
-------------------------------

You can signup with Auth0 for free. After you have followed the registration process, make sure you take note of the *Client ID* and the url of your auth connection.
You will need these values for the configuration of our Meteor Project.

Create a database under the Connections option. After creating this edit the database and make sure you enable the option '*Clients Using This Connection*' under the Settings tab.

Step 2: Check out the Meteor project
---------------------------------------------------------
Clone the project from our bitbucket repo.

**Update the settings.json**
Check the *settings.json* and amend the following values:

      "auth0" : {
        "baseUrl":                         "https://[YOUR-AUTH-URL-HERE].auth0.com/"
      , "clientId":                        "[YOUR-CLIENTID-HERE]"
      , "connection":                      "[YOUR-CONNECTION-DATABASE]"
      , "signUp":                          "dbconnections/signup"
      , "login":                           "oauth/ro"
      , "delegation":                      "delegation"
      , "passwordGrant":                   "password"
      , "jwtGrant":                        "urn:ietf:params:oauth:grant-type:jwt-bearer"
      , "scope":                           "openid name email user_metadata"
    }

**First run**
Do an 'npm install' first and then run the meteor app with the settings file:

    meteor --settings settings.json

This  will run the example app which will let you register a user in Auth0 and log you in.
After that, you can log out and login with the new user again.
Use Robomongo if you don't like using Mongo console, to check your user records.

**The magic...**

To implement the Auth0 service , we need to override the Accounts package login and registration handlers so it will run through Auth0 first.

The registration is handled in the file `server/methods/auth.method.js` where we register the user in Auth0 and then call the `Accounts.updateOrCreateUserFromExternalService` function to register the user in Mongo.

Login in is handled in the client side by calling the `Accounts.callLoginMethod` which calls the loginHandler we registered in the `AccountsOverride` that uses Auth0 to verify the existence of the user.

That's it!
