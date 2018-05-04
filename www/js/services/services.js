/**
 * Created by user on 28/02/2018.
 */
app
  .service('API', function (Restangular, $localStorage, $state, $sessionStorage) {
    var headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/x.laravel.v1+json',
      'show_loading':false
    }

    return Restangular.withConfig(function (RestangularConfigurer) {
      RestangularConfigurer
        .setBaseUrl(ApiUrl)
        .setDefaultHeaders(headers)
        .setErrorInterceptor(function (response) {
          if (response.status === 422) {
            // for (var error in response.data.errors) {
            // return ToastService.error(response.data.errors[error][0])
            // }
            console.log(response)
          }
          if (response.status === 401) {
            $state.go('connexion');
          }
        })
        .addFullRequestInterceptor(function (element, operation, what, url, headers) {
          var token = $sessionStorage.accessToken;
          if (token) {
            headers.Authorization = 'Bearer ' + token;
            headers['Access-Token'] = token
          }
        })
        .addResponseInterceptor(function (data, operation, what, url, response, deferred) {
          if (operation === 'getList') {
            if (Array.isArray(data)) {
              return data;
            }
            var newResponse = response.data.data;
            newResponse.metadata = _.omit(response.data, 'data');
            // newResponse.error = response.error
            return newResponse
          }

          return response
        })
    })

  });
