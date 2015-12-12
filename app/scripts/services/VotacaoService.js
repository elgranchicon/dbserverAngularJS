'use strict';

var app = angular.module('dbserverApp');

app.factory('VotacaoServiceListarInserir', ['$resource', 
    function ($resource) {
        return $resource('http://localhost:9009/sistema/votacao', {}, {
            listar: {method: 'GET', isArray: true},
            inserir: {method: 'POST'}
        }); 
    }
]);

app.factory('VotacaoServiceBuscarPorIdExcluir', ['$resource', 
    function ($resource) {
        return $resource('http://localhost:9009/sistema/votacao/:id', {}, {
            excluir: {method: 'DELETE'},
            buscarPorId: {method: 'GET'}
        }); 
    }
]);

app.factory('VotacaoServicePesquisar', ['$resource', 
    function ($resource) {
        return $resource('http://localhost:9009/sistema/votacaos/pesquisar', {}, {
            pesquisar: {method: 'POST', isArray: true}
        }); 
    }
]);
