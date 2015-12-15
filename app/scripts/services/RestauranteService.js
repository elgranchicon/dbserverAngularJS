'use strict';

var app = angular.module('dbserverApp');

app.factory('RestauranteServiceListarInserir', ['$resource', 'configuration', 
    function ($resource, configuration) {
        return $resource(configuration.API_BASE_URL + '/restaurante', {}, {
            listar: {method: 'GET', isArray: true},
            inserir: {method: 'POST'}
        }); 
    }
]);

/*
app.factory('RestauranteServiceBuscarPorIdExcluir', ['$resource', 'configuration',  
    function ($resource, configuration) {
        return $resource(configuration.API_BASE_URL + '/restaurante/:id', {}, {
            excluir: {method: 'DELETE'},
            buscarPorId: {method: 'GET'}
        }); 
    }
]);

app.factory('RestauranteServicePesquisar', ['$resource', 'configuration',  
    function ($resource, configuration) {
        return $resource(configuration.API_BASE_URL + '/restaurantes/pesquisar', {}, {
            pesquisar: {method: 'POST', isArray: true}
        }); 
    }
]);
*/