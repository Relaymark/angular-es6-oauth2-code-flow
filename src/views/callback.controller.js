export default class CallbackController {
    constructor($state, svOAuth2 ) {
        svOAuth2.getAccessToken( $state.params.code).then(function() {
            $state.go('main.dashboard');
        }, function(failed){
            $state.go('login'); //try to relog or show an awesome error page.
        });
    }
}

CallbackController.$inject = ['$state', 'svOAuth2'];