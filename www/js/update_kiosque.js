/**
 * Created by user on 28/02/2018.
 */
app
  .controller('UpdateKiosqueCtrl', function($scope,$state,Restangular,$cordovaGeolocation,$stateParams,$auth,$sessionStorage,$ionicLoading,Kiosques,Kiosque_service,Services,ionicToast) {

    /*on doit recuperer la liste des kiosques de lutilisateur conneceter*/
 //alert($stateParams.kiosque_id);
    /*on recupere egalement la liste des services*/
    $scope.$on('$ionicView.enter', function () {
      $ionicLoading.show({
        template: 'Loading...',
      })
       $scope.data = {};
      Services.getList().then(function (data) {
        $scope.liste_services = data;
        console.log('liste des services',$scope.liste_services);
      },function (error) {
        $ionicLoading.hide();
        alert('Une erreur est survenue')
      })
      /*on recupere tous les services du kiosque*/
      //Kiosque_service.one('kiosque_service',{kiosque_id:$stateParams.kiosque_id});
      Kiosque_service.getList({kiosque_id:$stateParams.kiosque_id}).then(function (data) {
        $scope.kiosque_service = data;
        /*dans la liste des services, on va mettre a true chaque service presnt dans kiosque_service*/
        console.log('liste des kiosque_services',$scope.kiosque_service)
        /*on initialise tout a false*/
        angular.forEach($scope.liste_services,function (valeur,cle) {
          $scope.liste_services[cle].checked = false;
        })
        /*foreach sur la liste des kiosque_services*/
        angular.forEach($scope.kiosque_service,function (value,key) {
          /*pour chaque valeur ici, on verifie a quel id du service correspond le service id et on le met a true*/
          console.log('service_id',value.service_id)
          angular.forEach($scope.liste_services,function (valeur,cle) {
            console.log('id',valeur.id)
            if(value.service_id == valeur.id){
              /*on met a true*/
              $scope.liste_services[cle].checked = true;
            }
          })
        })



        console.log('resultat apres le foreach',$scope.liste_services);
      },function (error) {
        $ionicLoading.hide();
        alert("une erreur est survenue")
      })

      /*on recupere les information sur le kiosque*/
      Kiosques.get($stateParams.kiosque_id).then(function (response) {
        $ionicLoading.hide();
        console.log(response)
        $scope.data = response.data;
        console.log($scope.data);

      },function (error) {
        $ionicLoading.hide();
      })
    });


      $scope.compte_boutique_update = function (isValid) {
        if(isValid){
          /*on se rassure kau moins un service est cocher*/
          var service=[];
          var i=0;
          angular.forEach($scope.liste_services,function (value,key) {
            if(value.checked == true){
              service[i] = value.id;
              i++;
            }
          })
          if(service.length ==0){
            alert("selectionner au moins un service")
          }else{
            /*ensuite on fait la requete normalement*/
            $ionicLoading.show({
              template: 'Loading...',
            })
            $scope.data.service = service;

            var Kiosque_update = Restangular.one('kiosque',$scope.data.id)
            console.log('donne avant la requete',$scope.data)
            $scope.data.statut = 1;
            Kiosque_update.put($scope.data).then(function (response) {
              console.log('reponse apres le put',response)
              /*on fait une deuxieme requete pour la mise a jour des services*/
              var Kiosque_service_update = Restangular.all('kiosque_service');
              $scope.data.kiosque_id = $stateParams.kiosque_id;
              Kiosque_service_update.post($scope.data).then(function (data) {
                /*on a le resultat de la requete a ce niveau*/
                $ionicLoading.hide();
                ionicToast.show('Mise à jour effectuée avec succès', 'middle', false, 2500);
                console.log(data)
              },function (error) {
                $ionicLoading.hide();
              })
            },function (error) {
              console.log(error)
              $ionicLoading.hide();
            })
            console.log($scope.data.service)

            /*on fait une requete pour la mise a jour du kiosque*/

            /*on fait une requete pour la mise a jour des services*/
          }

        }

      }

      $scope.changer_position = function () {
        /*cette fonction permet de changer les positions latitudes et longitude de la boutique*/
        $ionicLoading.show({
          template: 'Loading...',
        })
        var options = {timeout: 10000, enableHighAccuracy: true};
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
