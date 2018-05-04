// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var ApiUrl = 'http://localhost/mobile_money_admin/public/api';
var app = angular.module('starter', ['ionic', 'starter.controllers','ngCordova','restangular','satellizer','ngStorage','ionic-toast'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$authProvider) {
// Satellizer configuration that specifies which API
  // route the JWT should be retrieved from
  $authProvider.loginUrl = ApiUrl+'/authenticate';
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/connexion');
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

.state('app.ajout_kiosque', {
      url: '/ajout_kiosque',
      views: {
        'menuContent': {
          templateUrl: 'templates/ajout_kiosque.html',
          controller:'AjoutKiosqueCtrl'
        }
      }
    })
    .state('app.update_compte', {
      url: '/update_compte',
      views: {
        'menuContent': {
          templateUrl: 'templates/update_compte.html',
          controller:'UpdateCompteCtrl'
        }
      }
    })
    .state('app.statut_kiosque', {
      url: '/statut_kiosque',
      views: {
        'menuContent': {
          templateUrl: 'templates/statut_kiosque.html',
          controller:'StatutKiosqueCtrl'
        }
      }
    })
    .state('app.liste_kiosque', {
      url: '/liste_kiosque',
      views: {
        'menuContent': {
          templateUrl: 'templates/liste_kiosque.html',
          controller: 'ListeKiosqueCtrl'
        }
      }
    })
    .state('app.update_kiosque', {
      url: '/update_kiosque/:kiosque_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/update_kiosque.html',
          controller: 'UpdateKiosqueCtrl'
        }
      }
    })
    .state('app.accueil', {
      url: '/accueil',
      views: {
        'menuContent': {
          templateUrl: 'templates/accueil.html'
        }
      }
    })

.state('connexion',{
      url: '/connexion',
      templateUrl:'templates/connexion.html',
      controller: 'ConnexionCtrl'
    })
    .state('register',{
      url: '/register',
      templateUrl:'templates/register.html',
      controller: 'RegisterCtrl'
    })
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });

})

.config(function(RestangularProvider) {
    //set the base url for api calls on our RESTful services
    var newBaseUrl = ApiUrl;

    RestangularProvider.setBaseUrl(newBaseUrl);
  });
