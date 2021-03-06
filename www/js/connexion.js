/**
 * Created by user on 20/02/2018.
 */
app
  .controller('ConnexionCtrl', function($scope,$state,Restangular,$cordovaGeolocation,$stateParams,$auth,$sessionStorage,$ionicLoading,$translate) {
    $scope.data = {};
    $scope.flag = "fr";
    $scope.langue = "Français";
    $scope.login = function () {
      console.log($scope.data);
      /*on va finaliser avec le processus de connexion plutard*/
      var credentials = {
        username: $scope.data.username,
        password: $scope.data.password
      }
      $ionicLoading.show({
        template: 'Loading...',
      })
      $auth.login(credentials).then(function(data) {


        // If login is successful, redirect to the users state
        /*on recupere l'id dde lutilisateur qui vient de se connecter a partir de son nom d'utilisateur*/
        var User = Restangular.one('user');
        User.get({username:$scope.data.username}).then(function (data) {
          $ionicLoading.hide();
console.log(data);
          $sessionStorage.user_id = data.data[0].id;
          console.log($sessionStorage.user_id)
        },function (error) {
          console.log(error);
        })
        $state.go('app.accueil');
      },function (error) {
        console.log(error)
        $ionicLoading.hide();
        console.log(error.status);
        if(error.status==401){
          //$scope.error = error.data.error;
          $translate('parametre_invalide').then(function (translation) {
            $scope.error = translation;
          })

        }

      });
    }

    $scope.logout = function () {
      /**/
      $auth.logout();
      $state.go('connexion');
    }

    $scope.update_langue = function (langue) {
      /*on recupere la langue*/
      //alert(langue);
      if (langue == "Anglais") {
        $translate.use("fr");
        $scope.flag = "fr";
        $scope.langue = "Français";
      } else {
        $translate.use("en");
        $scope.flag = "gb";
        $scope.langue = "Anglais";
      }
      //$rootScope.lang = $translate.use();
      $state.go($state.current, {}, {reload: true});
      /*permet de recharger la page courrante pour update la langue*/
    }
  });
