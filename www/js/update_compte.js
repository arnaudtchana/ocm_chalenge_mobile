/**
 * Created by user on 04/03/2018.
 */
app
  .controller('UpdateCompteCtrl', function($scope,$state,Restangular,$cordovaGeolocation,$stateParams,$auth,$sessionStorage,Users,Persons,$ionicLoading,ionicToast,$translate) {

    //$scope.initial = {};

    /*on recupere les informations du user et de la personne*/
    $scope.$on('$ionicView.enter', function () {
      $ionicLoading.show({
        template: 'Loading...',
      })
       $scope.data = {};
    Persons.getList({user_id:$sessionStorage.user_id}).then(function (data) {
      console.log("information de la personne",data);
      $scope.data = data[0];
      $scope.ancien_tel = data[0].tel;
      Users.get($sessionStorage.user_id).then(function (data) {
      $ionicLoading.hide();
        console.log("les information du user",data);
        $scope.data.username = data.data.username;
        $scope.ancien_username = data.data.username;
        console.log("voici la valeur de la variable data final",$scope.data);
      },function (error) {
            $ionicLoading.hide();
        console.log("une erreur est survenue")
      })
    },function (error) {
          $ionicLoading.hide();
      console.log("une erreur est survenue")
    })
    });
    /*on recupere les informations du users a present*/


    $scope.valide_num = function(numero){
      var test = Math.floor(numero/100000000);
      if((test ===6 || test ===2 )&& numero.length ===9){
        return true;
      }else{
        return false;
      }
    }
    $scope.update_compte = function () {
      console.log($scope.data);
      /*on controle la validite du numero de telephone*/
      $test = $scope.valide_num($scope.data.tel);
      if($test===true){
        /*on teste si le mot de passe et la confimation sont bons*/
        console.log($scope.data.password)
        if($scope.data.password !== $scope.data.password_confirm){
          $translate('password_different_confirmation').then(function (translation) {
            alert(translation);
          })

          $scope.data.password = "";
          $scope.data.password_confirm = "";
        }else {
          var Update_person = Restangular.one('person',$scope.data.id);
          var person_update = {
            "nom" : $scope.data.nom,
            "prenom" : $scope.data.prenom,
            "tel" : $scope.data.tel
          }

          var User_update = Restangular.one('user',$sessionStorage.user_id);
          var user_all = {
            "username" : $scope.data.username,
            "password" : $scope.data.password
          }

            /*on verifie si le nouveau numero est disponible*/
            console.log("le numero a changer");
            $ionicLoading.show({
              template: 'Loading...',
            })
            Persons.getList({tel:$scope.data.tel}).then(function (response) {
              if(response.metadata.total !=0 && $scope.data.tel != $scope.ancien_tel){
                $ionicLoading.hide();
                $translate('tel_deja_utiliser').then(function (translation) {
                  $scope.error_nouveau_tel = translation;
                })

              }else{
                /*on fait la mise a jour*/
                /*on fait la mise a jour a ce niveau en commencant par la personne*/

                Update_person.put(person_update).then(function (data) {
                  console.log("mise a jour effectuee")
                  ionicToast.show('Mise à jour effectuée avec succès', 'middle', false, 2000);
                  if($scope.data.username !=$scope.ancien_username){
                    /*le username a changer on voit si le mot de passe aussi*/
                    /*on se rassure que le nouveau nom d'utilisateur n'est pas encore utiliser*/
                    Users.getList({username:$scope.data.username}).then(function (data) {
                      if(data.metadata.total !=0){
                        $ionicLoading.hide();
                        $translate('username_utiliser').then(function (tanslation) {
                          $scope.error_username = tanslation;
                        })

                      }else{
                        /*on continue*/
                        if($scope.data.password ==undefined || $scope.data.password==""){
                          /*on fait la mise a jour du username seulement*/
                          var user_username = {
                            "username" : $scope.data.username
                          }
                          User_update.put(user_username).then(function (response) {
                            $ionicLoading.hide();
                            console.log('mise a jour effectuee')
                            ionicToast.show('Mise à jour effectuée avec succès', 'middle', false, 2000);
                          },function (error) {
                            $ionicLoading.hide();
                          })
                        }else {
                          /* on fait la mise a jour des deux*/
                          User_update.put(user_all).then(function (response) {
                            $ionicLoading.hide();
                            console.log('mise a jour effectuee')
                            ionicToast.show('Mise à jour effectuée avec succès', 'middle', false, 2000);
                          },function (error) {
                            $ionicLoading.hide();
                          })
                        }
                      }
                    },function (error) {
                      $ionicLoading.hide();
                    })

                  }else{
                    if($scope.data.password ==undefined || $scope.data.password==""){
                      $ionicLoading.hide();
                      /*on fait rien*/
                    }else {
                      /* on fait la mise a jour du mot de passe*/
                      User_update.put(user_all).then(function (response) {
                        $ionicLoading.hide();
                        console.log('mise a jour effectuee')
                        ionicToast.show('Mise à jour effectuée avec succès', 'middle', false, 2000);
                      },function (error) {
                        $ionicLoading.hide();
                      })
                    }
                  }

                  /*on voit si le mot de passe existe*/

                },function (error) {
                  $ionicLoading.hide();
                  console.log("une erreur est survenu")
                })
              }

              console.log(response.metadata.total);
            },function (error) {
              $ionicLoading.hide();
            })



        }

      }else{
        $translate('tel_invalide').then(function (translation) {
          alert(translation);
        })

        $scope.data.tel = "";
      }
      /*ensuite l'identite des deux mot de passe*/
      /*on va finaliser avec le processus de connexion plutard*/
    }
  });
