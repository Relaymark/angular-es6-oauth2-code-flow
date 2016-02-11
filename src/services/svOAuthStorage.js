export default class svOAuthStorage {


    constructor() {
        this.config = {
            name: 'token'
        };
    }

    configure(params) {
        // Check if is an `object`.
        if (!(params instanceof Object)) {
            throw new TypeError('Invalid argument: `config` must be an `Object`.');
        }
        // Extend default configuration.
        angular.extend(this.config, params);
        return this.config;
    }

    /*@ngInject*/
    $get($localStorage) {
        var self = {};
        var config = this.config;

        self.applySlidingStorage = function () {
            var result = $localStorage.token;
            //if sliding exp. is required => set the cookie again.
            if (result && result.lastOptions && result.lastOptions.sliding && result.lastOptions.sliding === true) {
                self.removeToken();
                self.setToken(result.data, result.lastOptions.remember);
            }
        };

        self.getToken = function () {
            return $localStorage[config.name];
        };

        self.setToken = function (data) {
            $localStorage[config.name] = data;
            return $localStorage[config.name];
        };


        self.getAuthorizationHeader = function () {
            var token = self.getToken();
            if (!token) {
                return;
            }

            let tokenType = token['token_type'];
            let accessToken = token['access_token'];
            if (!(tokenType && accessToken)) {
                return;
            }

            let result = '' + (tokenType.charAt(0).toUpperCase() + tokenType.substr(1)) + ' ' + accessToken;
            return result;
        };


        self.getAccessToken = function () {
            var token = self.getToken();
            return token ? token['access_token'] : undefined;
        };

        self.getTokenType = function () {
            var token = self.getToken();
            return token ? token['token_type'] : undefined;
        };

        self.getRefreshToken = function () {
            var token = self.getToken();
            return token ? token['refresh_token'] : undefined;
        };

        self.removeToken = function () {
            delete $localStorage[config.name];
        };

        self.removeCode = function () {
            delete $localStorage.oauth_code;
        };
        self.setCode = function(code){
            $localStorage.oauth_code = code;
            return $localStorage.oauth_code;
        };
        self.getCode = function(){
            return $localStorage.oauth_code;
        };

        return self;

    }
}
