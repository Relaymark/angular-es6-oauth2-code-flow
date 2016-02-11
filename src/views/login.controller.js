
export default class LoginController {
    constructor( svOAuthStorage, svOAuth2, $rootScope) {

        //var defaultRememberMe = true;

        let rmLoginVm = this;
        rmLoginVm.isLogged = angular.isDefined(svOAuthStorage.getToken());

        rmLoginVm.login = function(){
            svOAuth2.getAccessCode();
        };

        rmLoginVm.logout = function(){
            svOAuth2.revokeToken().then(function(){
                rmLoginVm.isLogged = angular.isDefined(svOAuthStorage.getToken());
                $rootScope.$broadcast('oauth:logout');
            });
        };
    }
}
rmLoginController.$inject = ['svOAuthStorage', 'svOAuth2', '$rootScope'];