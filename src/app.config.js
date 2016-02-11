

config.$inject = ['OAuthConfiguration',  'svOAuthStorageProvider', '$httpProvider', 'svOAuth2Provider' ];
export default function config(OAuthConfiguration, svOAuthStorageProvider, $httpProvider, svOAuth2Provider){
    $httpProvider.interceptors.push('svOAuthInterceptor');

    svOAuth2Provider.configure({
        baseUrl: OAuthConfiguration.ENDPOINT_AUTH,
        clientId: OAuthConfiguration.AUTH_CLIENT_ID,
        clientSecret: OAuthConfiguration.AUTH_CLIENT_SECRET,
        scope: OAuthConfiguration.AUTH_SCOPE,
        redirectUri:OAuthConfiguration.AUTH_CALLBACK
    });
}
