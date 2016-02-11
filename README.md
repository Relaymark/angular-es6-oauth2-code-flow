# angular-es6-oauth2-code-flow
This is an client side (or called user-agent in oauth2 rfc) implementation of the authorization code flow. We wrote it in angular 1.4 with es6 using babel.

## How to use
 Install ngstorage (npm install ngstorage or bower install ngstorage).

 Add module to your project and modify with your constants (see app.js and app.config.js).
 
 If you want to revoke your token on your server, you should uncomment the code in svOAuth2.revokeToken().
 
## What's going on ?
 First, your use will go on login.html page. He will have a single sign in button. He will click on it and then will be redirect to your auth server.
 
 At this point, the user will enter his credentials. The auth server will redirect the user on your AUTH_CALLBACK constant with a code parameter in the query string.
 
 Here, the controller will ask to svOAuth2 to request a token from the access code . When your auth server your are logged ! 
 
 Congratulation !
  
 Your new token is store in the localstorage.
 
## Interceptors ?
 We use an interceptor for two goals : 
 
 * To add authorization header on every request.
  
 * To catch every http status code 400 (invalid_request or invalid_grant error), 401 (unauthorized) and 0 (offline error).
 
 In the http status code 400 we will remove the token and emit an oauth:error event.
 In the http status code 401 we refresh our token (by using refresh token) if we have one and we will retry (once) the request. If the renewal failed we will emit an oauth:loginRequired event.
 In the http status code 0 we will emit an oauth:apiOffline event 
 
 
 