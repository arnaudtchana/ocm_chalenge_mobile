/**
 * Created by user on 27/02/2018.
 */
app
  .controller('StatutKiosqueCtrl', function($scope,$state,Restangular,$cordovaGeolocation,$stateParams,$auth,$sessionStorage,$ionicLoading) {
    $scope.data = {};
    /*on doit recuperer la liste des kiosques de lutilisateur conneceter*/
    /*on lance le loading ici*/
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
          $scope.aucune_boutique = "Pas de kiosque enregistré";
        }else{
          $scope.texte_boutique = "Vous pouvez changer le statut d'une boutique pour dire si elle est fermée ou pas";
        }
        $scope.kiosques_user = data.data;
        console.log(data.total);
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
