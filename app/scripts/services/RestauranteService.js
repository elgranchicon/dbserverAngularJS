'use strict';

var app = angular.module('dbserverApp');

app.factory('RestauranteServiceListarInserir', ['$resource', 
    function ($resource) {
        return $resource('http://localhost:9009/sistema/restaurante', {}, {
            listar: {method: 'GET', isArray: true},
            inserir: {method: 'POST'}
        }); 
    }
]);

app.factory('RestauranteServiceBuscarPorIdExcluir', ['$resource', 
    function ($resource) {
        return $resource('http://localhost:9009/sistema/restaurante/:id', {}, {
            excluir: {method: 'DELETE'},
            buscarPorId: {method: 'GET'}
        }); 
    }
]);

app.factory('RestauranteServicePesquisar', ['$resource', 
    function ($resource) {
        return $resource('http://localhost:9009/sistema/restaurantes/pesquisar', {}, {
            pesquisar: {method: 'POST', isArray: true}
        }); 
    }
]);

app.factory('RestauranteServicePesquisarPossiveis', ['$resource', 
    function ($resource) {
        return $resource('http://localhost:9009/sistema/restaurantes/pesquisarPossiveis', {}, {
            pesquisar: {method: 'POST', isArray: true},
        }); 
    }
]);