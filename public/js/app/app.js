'use strict';
angular.module('app', ['ui.router', 'ui.bootstrap'])
.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$sceProvider', function ($locationProvider, $stateProvider, $urlRouterProvider, $sceProvider){
    
    $sceProvider.enabled(false);
    
    //$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    $urlRouterProvider.otherwise("/?q=&start=0&focus=0");
    $stateProvider
    .state('index', {
        url: "/",
        template: ""
    })
}]);