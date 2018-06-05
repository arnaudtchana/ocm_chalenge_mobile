/**
 * Created by user on 27/02/2018.
 */
app
  .controller('StatutKiosqueCtrl', function($scope,$state,Restangular,$cordovaGeolocation,$stateParams,$auth,$sessionStorage,$ionicLoading,ionicToast,$translate) {
    $scope.data = {};
    /*on doit recuperer la liste des kiosques de lutilisateur conneceter*/
    /*on lance le loading ici*/
    /*$scope.change_depot = function(index){
     console.log( $scope.kiosques_user[index]);
    }*/
    $scope.$on('$ionicView.enter', function () {
      $scope.aucune_boutique = "";
      $scope.texte_boutique = "";
      $ionicLoading.show({
        template: 'Loading...',
      })
      var Kiosque = Restangular.one('kiosque');
      Kiosque.get({user_id:$sessionStorage.user_id}).then(function (data) {
        $ionicLoading.hide();
        if(data.total ==0){
          $translate('pas_de_kiosque').then(function (translation) {
            $scope.aucune_boutique = translation;
          });
        }else{

          $translate('texte_statut_kiosque').then(function (translation) {
            $scope.texte_boutique = translation;
          })
        }
        $scope.kiosques_user = data.data;
        /*angular.forEach($scope.kiosques_user,function (value,cle) {
          //console.log('id',valeur.id)
          if(value.depot == true){
            /!*on met a true*!/
            $scope.kiosques_user[cle].depot.checked = true;
          }
          if(value.retrait == true){
            /!*on met a true*!/
            $scope.kiosques_user[cle].retrait.checked = true;
          }
        })*/
        console.log(data.total,$scope.kiosques_user);
      },function (error) {
        $ionicLoading.hide();
      })

      $scope.update_statut = function (index) {
        console.log('on modifie le statut',index);
        console.log($scope.kiosques_user[index]);
        /*on fait la requete put sur le kiosque concerne*/
        $ionicLoading.show({
          template: 'Loading...',
        })
        var Kiosque_statut = Restangular.one('kiosque',$scope.kiosques_user[index].id);
        Kiosque_statut.put($scope.kiosques_user[index]).then(function (response) {
          console.log(response)
          $ionicLoading.hide();
          ionicToast.show('Mise à jour effectuée avec succès', 'middle', false, 2000);
        },function (error) {
          $ionicLoading.hide();
          console.log(error)
        })
      }

      $scope.valide_statut = function () {
        console.log($scope.kiosques_user)
        Kiosque.data = $scope.kiosques_user;
        Kiosque.put().then(function (response) {
          console.log(response);
        },function (error) {
          console.log(error)
        })
      }
    });


  });
