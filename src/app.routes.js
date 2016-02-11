
import loginTemplate from './views/login.html';
import callbackTemplate from './views/callback.html';

routes.$inject['$stateProvider', '$urlRouterProvider', '$locationProvider'];

export default function routes($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider.state("login", {
        url: "/login",
        templateUrl: loginTemplate,
        controller: 'LoginController',
        controllerAs: "login"
    }).state("callback", {
        url: "/callback?code",
        templateUrl: callbackTemplate,
        controller: 'CallbackController',
        controllerAs: "oAuthVM"
    });


    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
}