/**
 * Created by user on 20/02/2018.
 */
app
  .controller('RegisterCtrl', function($scope,$state,Restangular,$cordovaGeolocation,$stateParams,$auth,$sessionStorage,$ionicPopup) {
    $scope.data = {};
    $scope.valide_num = function(numero){
      var test = Math.floor(numero/100000000);
      if((test ===6 || test ===2 )&& numero.length ===9){
        return true;
      }else{
        return false;
      }
    }
    $scope.register = function (isValid) {
    //alert(isValid)
    if(isValid){
    console.log($scope.data);
      /*on controle la validite du numero de telephone*/
      $test = $scope.valide_num($scope.data.tel);
      if($test===true){
        /*on teste si le mot de passe et la confimation sont bons*/
        if($scope.data.password !== $scope.data.password_confirm){

          // An alert dialog
   var alertPopup = $ionicPopup.alert({
     title: 'Attention !',
     template: 'le mot de passe et la confirmation ne sont pas identiques '
   });

   /*alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });*/

          $scope.data.password = "";
          $scope.data.password_confirm = "";
        }else {
          /*on continue avec la creation de compte*/
          var Register = Restangular.all('register');
          Register.post($scope.data).then(function (data) {
            if(data.error){
              $scope.error = data.error;
            }else{
              /*si il n'y a pas derreur on passe a la page daccueil*/
              /*ici on connecte l'utilisateur*/
              var credentials = {
                username: $scope.data.username,
                password: $scope.data.password
              }
              $auth.login(credentials).then(function(data) {

                // If login is successful, redirect to the users state
                /*on recupere l'id dde lutilisateur qui vient de se connecter a partir de son nom d'utilisateur*/
                var User = Restangular.one('user');
                User.get({username:$scope.data.username}).then(function (data) {
                  console.log(data);
                  $sessionStorage.user_id = data.data[0].id;
                  console.log($sessionStorage.user_id)
                },function (error) {
                  console.log(error);
                })
                $state.go('app.accueil');
              },function (error) {
                /*en cas d'erreur, on rentre une fois de plus au niveau de la page d'accueil*/
                $state.go('app.accueil');
              });
            }
            console.log(data);
          },function (error) {
            alert("une erreur est survenue")
          })
        }

      }else{

         // An alert dialog
   var alertPopup = $ionicPopup.alert({
     title: 'Attention !',
     template: 'Numéro de téléphone invalide '
   });
        $scope.data.tel = "";
      }
      /*ensuite l'identite des deux mot de passe*/
      /*on va finaliser avec le processus de connexion plutard*/
    }

    }
  });
