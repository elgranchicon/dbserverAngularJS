'use strict';

var app = angular
  .module('dbserverApp', [
    'dbserverConfig',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ]);

  app.config(function ($routeProvider) {
    $routeProvider.when('/sistema', {
        templateUrl: '/views/sistema.html',
        controller: 'SistemaCtrl'
      })  
      .otherwise({
        redirectTo: '/sistema' 
      }); 
  });

app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);
