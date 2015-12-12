'use strict';

var app = angular
  .module('dbserverApp', [
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