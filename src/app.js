//Packages
import angular from 'angular';
import uirouter from 'angular-ui-router';
import 'ngstorage';

//Minimum configuration
import config from './app.config';
import routes from './app.routes';


//Services
import svOAuth2 from './services/svOAuth2';
import svOAuthStorage from './sservices/vOAuthStorage';
import svQueryStringHelper from './services/svQueryStringHelper';
import svOAuthInterceptor from './services/svOAuthInterceptor';
import svHttpBuffer from './services/svHttpBuffer';
import oauthConfiguration from './services/oauthConfiguration';

//Controllers
import LoginController from './views/login.controller.js';
import CallbackController from './views/callback.controller.js';


export default angular.module('relaymark.oauth2', [uirouter, 'ngStorage'])
    .provider('svOAuth2', svOAuth2)
    .provider('svOAuthStorage', svOAuthStorage)
    .factory('svQueryStringHelper', svQueryStringHelper)
    .factory('svOAuthInterceptor', svOAuthInterceptor)
    .factory('svHttpBuffer', svHttpBuffer)
    .constant("OAuthConfiguration", {
        ENDPOINT_API: "http://api.yourcompany.com",
        ENDPOINT_AUTH: "http://auth.yourcompany.com",
        AUTH_CLIENT_ID: "OAUTH CLIENT ID",
        AUTH_CLIENT_SECRET: "OAUTH CLIENT SECRET",
        AUTH_CALLBACK: "http://client.yourcompany.com/callback",
        TOKEN_AUTHORIZE_PATH: '/connect/authorize',
        AUTH_SCOPE: 'offline_access'
    })
    .config(config)
    .config(routes)
    .controller('LoginController', LoginController)
    .controller('CallbackController', CallbackController)
    .name;
