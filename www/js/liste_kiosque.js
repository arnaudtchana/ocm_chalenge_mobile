/**
 * Created by user on 28/02/2018.
 */
app
  .controller('ListeKiosqueCtrl', function($scope,$state,Restangular,$cordovaGeolocation,$stateParams,$auth,$sessionStorage,$ionicLoading,$ionicPopup,ionicToast) {
    $scope.data = {};
    /*on doit recuperer la liste des kiosques de lutilisateur conneceter*/
    $scope.$on('$ionicView.enter', function () {
      $scope.aucun_kiosque = "";
      $scope.info_modif = "";
      $ionicLoading.show({
        template: 'Loading...',
      })
      var Kiosque = Restangular.one('kiosque');
      Kiosque.get({user_id:$sessionStorage.user_id}).then(function (data) {
        $ionicLoading.hide();
        if(data.total == 0){
          $scope.aucun_kiosque = "Aucun kiosque enregistré"
        }else{
          $scope.info_modif = "Sélectionner le kiosque dont vous souhaitez modifier les informations";
        }
        $scope.kiosques_user = data.data;
        console.log(data);
      },function (error) {
        $ionicLoading.hide();
      })

      $scope.delete_kiosque = function (id) {
        /*on supprime le kiosque dont on a l'id en parametre*/
        //alert("le supprime le kiosque"+id);
        /*on affiche une boite de dialogue pour demander de confirmer la suppression*/
        // A confirm dialog
   var confirmPopup = $ionicPopup.confirm({
     title: 'Supprimer',
     template: 'Voulez-vous vraiment supprimer le kiosque ?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
        $ionicLoading.show({
            template: 'Loading...',
          })
        var Supprime_kiosque = Restangular.one('kiosque',id);
        Supprime_kiosque.remove().then(function (response) {
          var Kiosque = Restangular.one('kiosque');
          Kiosque.get({user_id:$sessionStorage.user_id}).then(function (data) {
          /*on met un toast a ce niveau pour dire que le kiosque vient detre supprimer*/
            $ionicLoading.hide();
            ionicToast.show('Kiosque supprimé avec succès', 'middle', false, 2500);
            $scope.kiosques_user = data.data;
            console.log(data);
          },function (error) {
            $ionicLoading.hide();
          })
        },function (error) {
          $ionicLoading.hide();
          alert('Une erreur est survenue');
        })
     } else {
       console.log('You are not sure');
     }
   });

      }
    });


  });
