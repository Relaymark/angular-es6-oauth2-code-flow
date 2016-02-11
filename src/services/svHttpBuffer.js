'use strict';
svHttpBuffer.$inject = ['$injector'];
export default function svHttpBuffer($injector) {

    var buffer = [];

    /** Service initialized later because of circular dependency problem. */
    var $http;

    var retryHttpRequest = function (config, deferred) {
        function successCallback(response) {
            deferred.resolve(response);
        }

        function errorCallback(response) {

            deferred.reject(response);
        }

        $http = $http || $injector.get('$http');
        $http(config).then(successCallback, errorCallback);
    };



    return {
        append(config, deferred) {
            buffer.push({
                config: config,
                deferred: deferred
            });
        },

            rejectAll(reason) {
            if (reason) {
                for (let i = 0; i < buffer.length; ++i) {
                    buffer[i].deferred.reject(reason);
                }
            }
            buffer = [];
        },

            retryAll(updater) {

            for (let i = 0; i < buffer.length; ++i) {
                retryHttpRequest(updater(buffer[i].config), buffer[i].deferred);
            }
            buffer = [];
        }
    };
}