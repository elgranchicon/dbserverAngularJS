'use strict';

var app = angular.module('dbserverApp');

app.factory('VotacaoServiceListarInserir', ['$resource', 'configuration', 
    function ($resource, configuration) {
        return $resource(configuration.API_BASE_URL + '/votacao', {}, {
            listar: {method: 'GET', isArray: true},
            inserir: {method: 'POST'}
        }); 
    }
]);

/*
app.factory('VotacaoServiceBuscarPorIdExcluir', ['$resource', 'configuration', 
    function ($resource, configuration) {
        return $resource(configuration.API_BASE_URL + '/votacao/:id', {}, {
            excluir: {method: 'DELETE'},
            buscarPorId: {method: 'GET'}
        }); 
    }
]);
*/

app.factory('VotacaoServicePesquisar', ['$resource', 'configuration', 
    function ($resource, configuration) {
        return $resource(configuration.API_BASE_URL + '/votacaos/pesquisar', {}, {
            pesquisar: {method: 'POST', isArray: true}
        }); 
    }
]);

app.factory('VotacaoServiceRestaurantesJaUtilizados', ['$resource', 'configuration',  
    function ($resource, configuration) {
        return $resource(configuration.API_BASE_URL + '/votacaos/restaurantesJaUtilizados', {}, {
            pesquisar: {method: 'POST', isArray: true},
        }); 
    }
]);

app.factory('VotacaoServiceResultados', ['$resource', 'configuration',  
    function ($resource, configuration) {
        return $resource(configuration.API_BASE_URL + '/votacaos/resultados', {}, {
            pesquisar: {method: 'POST', isArray: true},
        }); 
    }
]);

app.factory('VotacaoServiceResultadosInserir', ['$resource', 'configuration',  
    function ($resource, configuration) {
        return $resource(configuration.API_BASE_URL + '/votacaos/resultado', {}, {
            inserir: {method: 'POST'}
        }); 
    }
]);