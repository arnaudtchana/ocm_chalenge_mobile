/**
 * Created by user on 24/02/2018.
 */
app
  .controller('AjoutKiosqueCtrl', function($scope,$state,Restangular,$cordovaGeolocation,$auth,$sessionStorage,$ionicLoading) {

    /*on fait la requete restangular qui permet de recurer la liste des services en base de donnees
     * pour que lutilisateur choisisse le service qui l'interesse*/
    $scope.data = {};
    $scope.services = {};
    $scope.tel = "691612071";
    var options = {timeout: 10000, enableHighAccuracy: true};
    var Services = Restangular.all('service');

    Services.getList().then(function (data) {
      $scope.services = data;
      console.log($scope.services[0]);
      /*on fait un foreach sur le resultat et on ajoute le champs ckecked*/
      angular.forEach($scope.services,function (value,key) {
       // console.log(value);
        $scope.services[key].checked = false;
      })
      console.log($scope.services);
      //console.log($scope.services[0]);
    })
    $scope.$on('$ionicView.enter', function () {
      $ionicLoading.show({
        template: 'Loading...',
      })
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        $scope.data.latitude = position.coords.latitude;
        $scope.data.longitude = position.coords.longitude;
        $ionicLoading.hide();
      },function(error){
        $ionicLoading.hide();
        alert('Activer votre GPS')
      });
    });


    $scope.compte_boutique = function (isValid) {
      /*on verifie kau moins un service est cocher*/
      var service=[];
      var i=0;
      angular.forEach($scope.services,function (value,key) {
        if(value.checked == true){
          service[i] = value.id;
          i++;
        }
      })
      if(service.length ==0){
        alert("selectionner au moins un service")
      }else{
        /*on fait les requetes normalement*/
        console.log(service);
        if(isValid){
          /*on recupere le user_id et on cree le compte du kiosque*/
          //console.log($auth.getToken());
          /*on verifie que le nom de la butique n'est pas encore utiliser coter backend*/
          var Kiosque = Restangular.one('kiosque');
          Kiosque.get({nom_kiosque:$scope.data.nom_kiosque}).then(function (data) {
            console.log(data);
            if(data.total ==0){
              /*on cree le compte*/
              $scope.data.user_id = $sessionStorage.user_id;
              $scope.data.service = service;
              $ionicLoading.show({
                template: 'Loading...',
              })
              var Register = Restangular.all('kiosque');
              Register.post($scope.data).then(function (data) {
                $ionicLoading.hide();
                if(data.error){
                  $scope.error = data.error;
                }else{
                  /*si il n'y a pas derreur on passe a la page daccueil*/
                  $state.go('app.accueil');
                }
                console.log(data);
              },function (error) {
                $ionicLoading.hide();
                alert("une erreur est survenue")
              })
            }else{
              /*on envoie le message d'erreur*/
              $scope.erreur_nom_kiosque = "Le nom du kiosque est déjà utilisé";
              $scope.data.nom_kiosque="";
            }

          },function (error) {
            console.log(error)
          })

          //alert('on cree le compte')
        }
      }


    }

    $scope.changer_position = function () {
      /*cette fonction permet de changer les positions latitudes et longitude de la boutique*/
      $ionicLoading.show({
        template: 'Loading...',
      })
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        $ionicLoading.hide()
        $scope.data.latitude = position.coords.latitude;
        $scope.data.longitude = position.coords.longitude;
      },function (error) {
        $ionicLoading.hide()
        alert('Activer votre Gps');
      });

    }



  });
