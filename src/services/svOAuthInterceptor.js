/**
 * Interceptor used by $http to inject authorization header and handle errors.
 * On http status code 0 : emits an event named 'oauth:apiOffline'
 * On http status code 400 : emits an event named 'oauth:error'
 * On http status code 401 : if the token is expired, emits an event named 'oauth:loginRequired'
 *
 * Just add this interceptor to your app.js :
 * ```js
 *  app.config(function($httpProvider){
 *    $httpProvider.interceptors.push('svOAuthInterceptor');
*    });
 * ```
 */
export default function svOAuthInterceptor($log, $q, svHttpBuffer, $rootScope, svOAuthStorage, $injector, OAuthConfiguration) {
    var waitHandle;
    let svOAuthInterceptorVM = this;

    svOAuthInterceptorVM.processRefreshToken = function (rejection, deferred) {
        svHttpBuffer.append(rejection.config, deferred);

        $injector.invoke(function ($http, svOAuth2) {
            $log.warn('refreshTokenRequired');
            if (!waitHandle) {
                waitHandle = svOAuth2.getRefreshToken().then(
                    function () {
                        svHttpBuffer.retryAll(function (config) { //set good authorization headers
                            var authHeader = svOAuthStorage.getAuthorizationHeader();
                            if (authHeader) {
                                config.headers = config.headers || {};
                                config.headers.Authorization = authHeader;
                            }
                            config.$$alreadyRetried = true;
                            return config;
                        });
                        waitHandle = null;
                    }, function (error) {
                        svOAuthStorage.removeToken();
                        svHttpBuffer.rejectAll('refreshTokenFailed');
                        $rootScope.$emit('oauth:loginRequired', error);
                        waitHandle = null;
                    });
            }

        });
    };
    svOAuthInterceptorVM.$q = $q;
    svOAuthInterceptorVM.AppConstants = OAuthConfiguration;
    svOAuthInterceptorVM.svOAuthStorage = svOAuthStorage;

    return {
        request(config) {
            var requestUrl = config.url;
            if (requestUrl.indexOf(svOAuthInterceptorVM.AppConstants.ENDPOINT_API) === 0) {
                //Inject `Authorization` header.
                let authorizationHeader = svOAuthInterceptorVM.svOAuthStorage.getAuthorizationHeader();

                if (!config.headers.Authorization && authorizationHeader) {
                    svOAuthInterceptorVM.svOAuthStorage.applySlidingStorage();
                    config.headers = config.headers || {};
                    config.headers.Authorization = authorizationHeader;
                }
            }
            return config;

        },

        responseError(rejection) {
            // 400 Catch `invalid_request` and `invalid_grant` errors and ensure that the `token` is removed.
            if (rejection.status === 400 && rejection.data &&
                (rejection.data.error === 'invalid_request' || rejection.data.error === 'invalid_grant')) {
                svOAuthInterceptorVM.svOAuthStorage.removeToken();
                $rootScope.$emit('oauth:error', rejection);
                return svOAuthInterceptorVM.$q.reject(rejection);
            }

            // 401 Catch `Unauthorized` error. Token isn't removed here so it can be refreshed.
            if (rejection.status === 401 && rejection.data && rejection.statusText === 'Unauthorized') {
                let deferred = svOAuthInterceptorVM.$q.defer();
                let currentToken = svOAuthInterceptorVM.svOAuthStorage.getToken();

                if (!angular.isDefined(currentToken) || rejection.config.$$alreadyRetried) {
                    svOAuthInterceptorVM.svOAuthStorage.removeToken();
                    $log.warn('loginRequired');
                    $rootScope.$emit('oauth:loginRequired', rejection);
                }
                else {
                    svOAuthInterceptorVM.processRefreshToken(rejection, deferred);
                }

                return deferred.promise;
            }

            // Catch API Offline cases
            if (rejection.status === 0 || rejection.status === -1) {
                $rootScope.$emit('oauth:apiOffline', rejection);
            }

            //default behaviour
            return svOAuthInterceptorVM.$q.reject(rejection);
        }
    };
}
svOAuthInterceptor.$inject = ['$log', '$q', 'svHttpBuffer', '$rootScope', 'svOAuthStorage', '$injector', 'OAuthConfiguration'];