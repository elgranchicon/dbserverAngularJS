'use strict';

angular.module('dbserverApp')
    .controller('SistemaCtrl', ['$scope', '$filter', 
                'RestauranteServiceListarInserir', 
                'VotacaoServiceListarInserir', 'VotacaoServicePesquisar', 'VotacaoServiceRestaurantesJaUtilizados', 
                'VotacaoServiceResultados', 'VotacaoServiceResultadosInserir', 'ConfigService', 
    function ($scope, $filter, 
              RestauranteServiceListarInserir, 
                VotacaoServiceListarInserir, VotacaoServicePesquisar, VotacaoServiceRestaurantesJaUtilizados,
                VotacaoServiceResultados, VotacaoServiceResultadosInserir, ConfigService) {
        
        //------------------- menu

        $scope.scopeVotacao = {
            f: {},
            mensagemErro: '',
            _id: null,
            email: null,
            restaurante: null,
            data: geraDataAtual(),
            liberaTelaVotacao: null,
            listaRestaurantes: [],
            listaVotacaoHoje: []
        };
        $scope.scopeRestaurante = {
            f: {},
            _id: null,
            nome: null,
            listaRestaurantes: []
        };
        $scope.scopeResultados = {
            f: {},
            resultadoHoje: null,
            listaResultados: []
        };
        
        /*$scope.trocarServer = function(servidor) {
            ConfigService(servidor)
        };*/
        
        $scope.menu = 'votacao';

        $scope.trocarMenu = function(novoMenu) {
            $scope.menu = novoMenu; 
            if (novoMenu === 'votacao') {
                $scope.scopeVotacao.mensagemErro = '';
                $scope.scopeVotacao._id = null;
                $scope.scopeVotacao.email = null;
                $scope.scopeVotacao.restaurante = null;
                $scope.scopeVotacao.data = geraDataAtual();
                $scope.scopeVotacao.liberaTelaVotacao = null;
                $scope.scopeVotacao.listaRestaurantes = [];
                $scope.scopeVotacao.listaVotacaoHoje = [];
                $scope.scopeVotacao.votacaoEncerrada = null;
            }
            if (novoMenu === 'restaurante') {
                $scope.scopeRestaurante._id = null;
                $scope.scopeRestaurante.nome = null;
                $scope.scopeRestaurante.listaRestaurantes = [];
                $scope.scopeRestaurante.f.listarRestaurante();
            }
            if (novoMenu === 'resultados') {
                $scope.scopeResultados.listaResultados = [];
                $scope.scopeResultados.resultadoHoje = null;
                $scope.scopeResultados.f.listarResultados();
            }
        };
        
        //------------------- funcoes tela votacao
        
        function geraDataAtual() {
            return parseInt($filter('date')(new Date(),'yyyyMMdd'));
            //return parseInt("20151215");
        }
        
        function geraHoraAtual() {
            return parseInt($filter('date')(new Date(),'HHmmss'));
            //return 120000;
        }

        $scope.scopeVotacao.f.liberaTelaVotacao = function() {
            if ($scope.scopeVotacao.email !== null) {
                VotacaoServiceResultados.pesquisar(
                            {data: (geraDataAtual()-1)}).$promise
                .then(function(lista) {
                        if (lista.length > 0) {
                            $scope.scopeVotacao.liberaTelaVotacao = false;
                            $scope.scopeVotacao.mensagemErro = 'VOTAÇÃO ENCERRADA POR HOJE!';
                        } else {
                            VotacaoServicePesquisar.pesquisar(
                                        {email: $scope.scopeVotacao.email, 
                                         data: $scope.scopeVotacao.data}).$promise
                            .then(function(lista) {            
                                    if (lista.length > 0) {
                                        $scope.scopeVotacao.liberaTelaVotacao = false;
                                        $scope.scopeVotacao.mensagemErro = 'VOCÊ JÁ VOTOU, ESPERA O RESULTADO!';
                                    } else {
                                        $scope.scopeVotacao.liberaTelaVotacao = true;
                                        $scope.scopeVotacao.mensagemErro = '';
                                        pesquisarRestaurantesPossiveis();
                                    }
                            });
                        }
                    atualizaListaVotadosHoje();
                });
            }                
        };
    
        var pesquisarRestaurantesPossiveis = function() {
            if ($scope.scopeVotacao.email !== null) {
                VotacaoServiceRestaurantesJaUtilizados.pesquisar({data: (data2aFeiraDessaSemana()-1)}).$promise
                .then(function(lista) {
                        if (lista.length > 0) {
                            $scope.scopeVotacao.listaRestaurantes = lista;
                        } else {
                            $scope.scopeVotacao.listaRestaurantes = [];
                        }
                });
            }
        };
        
        $scope.scopeVotacao.f.salvarVotacao = function() {
            VotacaoServicePesquisar.pesquisar(
                            {email: $scope.scopeVotacao.email, 
                             data: $scope.scopeVotacao.data}).$promise
                .then(function(lista) {            
                        if (lista.length === 0) {
                            VotacaoServiceListarInserir.inserir(
                                    {email: $scope.scopeVotacao.email, 
                                     restaurante: $scope.scopeVotacao.restaurante, 
                                     data:$scope.scopeVotacao.data}).$promise
                            .then(function(item) {
                                    if (item !== null) {
                                        $scope.scopeVotacao._id = item._id;
                                        $scope.scopeVotacao.email= item.email;
                                        $scope.scopeVotacao.restaurante= item.restaurante;
                                        $scope.scopeVotacao.data= item.data;
                                        $scope.scopeVotacao.liberaTelaVotacao = false;
                                        //ou?
                                        /*$scope.scopeVotacao._id = null;
                                        $scope.scopeVotacao.email = null;
                                        $scope.scopeVotacao.restaurante = null;
                                        $scope.scopeVotacao.data = geraDataAtual();
                                        $scope.scopeVotacao.liberaTelaVotacao = null;
                                        $scope.scopeVotacao.listaRestaurantes = [];
                                        $scope.scopeVotacao.listaVotacaoHoje = [];*/

                                        atualizaListaVotadosHoje();
                                    }
                            });             
                        }
                });
        };
        
        var atualizaListaVotadosHoje = function() {
            VotacaoServicePesquisar.pesquisar({data: $scope.scopeVotacao.data}).$promise
                .then(function(lista) {
                        if (lista.length > 0) {
                            $scope.scopeVotacao.listaVotacaoHoje = lista;
                        } else {
                            $scope.scopeVotacao.listaVotacaoHoje = [];
                        }
                });
        };
    
        //------------------- funcoes tela restaurante
        
        $scope.scopeRestaurante.f.listarRestaurante = function() {
            RestauranteServiceListarInserir.listar().$promise
                .then(function(lista) {
                        if (lista.length > 0) {
                            $scope.scopeRestaurante.listaRestaurantes = lista;
                        } else {
                            $scope.scopeRestaurante.listaRestaurantes = [];
                        }
                });  
        };

        $scope.scopeRestaurante.f.salvarRestaurante = function() {
            if ($scope.scopeRestaurante.nome !== null && $scope.scopeRestaurante.nome.length > 0) {
                RestauranteServiceListarInserir.inserir({nome:$scope.scopeRestaurante.nome}).$promise
                    .then(function(/*item*/) {
                            //TODO usar esse cara (id) para editar futuramente
                            //$scope.scopeRestaurante._id = item._id;
                            //$scope.scopeRestaurante.nome = item.nome;

                            RestauranteServiceListarInserir.listar().$promise
                                .then(function(lista) {
                                    if (lista.length > 0) {
                                        $scope.scopeRestaurante.listaRestaurantes = lista;
                                        $scope.scopeRestaurante.nome = '';
                                    } else {
                                        $scope.scopeRestaurante.listaRestaurantes = [];
                                    }
                            });
                    });    
            }
        };

        var data2aFeiraDessaSemana = function() {
            var diaDaSemanaHoje = (new Date()).getDay(); //1 - segunda, 5 - sexta
            var dataAtual = geraDataAtual();
            return dataAtual - diaDaSemanaHoje;
            //return 20151214;
        };
        
        //------------------- funcoes tela resultados
        
        $scope.scopeResultados.f.listarResultados = function() {
                VotacaoServiceResultados.pesquisar(
                            {data: (data2aFeiraDessaSemana()-1)}).$promise
                .then(function(lista) {
                        $scope.scopeResultados.listaResultados = [];
                        atualizaResultadoHoje(lista);
                });
        };
        
        var atualizaResultadoHoje = function(lista) {
            var dataAtual = geraDataAtual();
            
            for (var i=0; i<lista.length; i++) {
                var resultado = lista[i];
                $scope.scopeResultados.listaResultados.push(resultado);
                
                if (resultado.data === dataAtual) {
                    $scope.scopeResultados.resultadoHoje = resultado;
                }
            }
            
            var agruparPorRestaurante = function(lista) {
                var arrIds = [];
                for (var i=0; i<lista.length; i++) {
                    var restauranteId = lista[i].restaurante._id;                
                    if (arrIds[restauranteId] === undefined) {
                        arrIds[restauranteId] = {soma: 0, obj:lista[i].restaurante};
                    }
                    arrIds[restauranteId].soma = arrIds[restauranteId].soma + 1;
                }
                return arrIds;
            };
            var restauranteMaisVotado = function(lista) {
                var restMaisVotado = null;
                var qtdVotado = 0;
                    
                for (var key in lista) {
                    if (lista[key].soma > qtdVotado) {
                        qtdVotado = lista[key].soma;
                        restMaisVotado = lista[key].obj;
                    }
                }
                console.log(restMaisVotado);
                return restMaisVotado;
            };
            
            var horaAtual = geraHoraAtual();
            if ($scope.scopeResultados.resultadoHoje === null && horaAtual > 115959) {
                VotacaoServicePesquisar.pesquisar({data: dataAtual}).$promise.then(
                    function(lista) {
                        if (lista.length > 0) {
                            var arrTotalPorRest = agruparPorRestaurante(lista);
                            var restMaisVotado = restauranteMaisVotado(arrTotalPorRest);
                            insereResultadoHoje(restMaisVotado, dataAtual);
                        } 
                });
            }
        };
        
        var insereResultadoHoje = function(restMaisVotado, dataAtual) {
            VotacaoServiceResultadosInserir.inserir(
                                {restaurante: restMaisVotado, 
                                 data:dataAtual}).$promise
            .then(function(item) {
                    if (item !== null) {
                        $scope.scopeResultados.resultadoHoje = item;
                    }
            });
        };
        
        
        
        
        /*
        
        $scope.inserir = function() {
            console.log('entrou inserir');

            if ($scope.email != null) {
                var a = RestauranteServiceListarInserir.inserir();
                console.log('...'+a);
            }            
        };

        $scope.excluir = function() {
            console.log('entrou excluir');
            
            //$scope._id = $stateParams.id;

            if ($scope.email != null) {
                var a = RestauranteServiceBuscarPorIdExcluir.excluir({_id: $scope._id});
                console.log('...'+a);
            }            
        };
        
        $scope.buscarPorId = function() {
            console.log('entrou buscarPorId');

            //$scope._id = $stateParams.id;
            
            if ($scope.email != null) {
                var a = RestauranteServiceBuscarPorIdExcluir.buscarPorId({_id: $scope._id});
                console.log('...'+a);
            }            
        };
        */
        
        
	}]);