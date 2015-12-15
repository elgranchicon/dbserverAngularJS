'use strict';

var app = angular.module('dbserverApp');

app.factory('ConfigService', ['$resource', 'configuration', 
    function ($resource, configuration) {
        return function(servidor) {
            if (servidor === 'jbossMysql') {
                configuration.API_BASE_URL = '//localhost:8080/web/restapp';
            } else {
                configuration.API_BASE_URL = '//localhost:9009';
            }
            console.log(configuration.API_BASE_URL);
        };
    }
]);

