'use strict';

angular.module('dbserverApp')
    .controller('SistemaCtrl', ['$scope', '$filter', 
                'RestauranteServiceListarInserir', 'RestauranteServiceBuscarPorIdExcluir', 'RestauranteServicePesquisar',
                'VotacaoServiceListarInserir', 'VotacaoServiceBuscarPorIdExcluir', 'VotacaoServicePesquisar', 
    function ($scope, $filter, 
              RestauranteServiceListarInserir, RestauranteServiceBuscarPorIdExcluir, RestauranteServicePesquisar,
                VotacaoServiceListarInserir, VotacaoServiceBuscarPorIdExcluir, VotacaoServicePesquisar) {
        //------------------- menu

        $scope.scopeVotacao = {
            f: {},
            mensagemErro: '',
            _id: null,
            email: null,
            restaurante: null,
            data: geraDataAtual(),
            liberaTelaVotacao: null,
            listaRestaurantes: []
        };
        $scope.scopeRestaurante = {
            f: {},
            _id: null,
            nome: null,
            listaRestaurantes: []
        };
        
        $scope.menu = 'votacao';
        $scope.trocarMenu = function(novoMenu) {
            $scope.menu = novoMenu; //restaurante
            if (novoMenu == 'votacao') {
                $scope.scopeVotacao.mensagemErro = '';
                $scope.scopeVotacao._id = null;
                $scope.scopeVotacao.email = null;
                $scope.scopeVotacao.restaurante = null;
                $scope.scopeVotacao.data = geraDataAtual();
                $scope.scopeVotacao.liberaTelaVotacao = null;
                $scope.scopeVotacao.listaRestaurantes = [];
                $scope.scopeVotacao.listaVotacaoHoje = [];
            }
            if (novoMenu == 'restaurante') {
                $scope.scopeRestaurante._id = null;
                $scope.scopeRestaurante.nome = null;
                $scope.scopeRestaurante.listaRestaurantes = [];
                $scope.scopeRestaurante.f.listarRestaurante();
            }
        };
        
        function geraDataAtual() {
            return $filter('date')(new Date(),'yyyyMMdd');
        }
        
        //------------------- funcoes tela votacao

        $scope.scopeVotacao.f.liberaTelaVotacao = function() {
            if ($scope.scopeVotacao.email != null) {
                VotacaoServicePesquisar.pesquisar({email: $scope.scopeVotacao.email}).$promise
                .then(function(lista) {            
                    if (lista.length > 0) {
                        $scope.scopeVotacao.liberaTelaVotacao = false;
                        $scope.scopeVotacao.mensagemErro = 'VOCÊ JÁ VOTOU, ESPERA O RESULTADO!'
                    } else {
                        $scope.scopeVotacao.liberaTelaVotacao = true;
                        $scope.scopeVotacao.mensagemErro = '';
                        
                        pesquisarRestaurantesPossiveis();
                    }

                    //atualizar lista de votados hoje
                    atualizaListaVotadosHoje();
                });
            }                
        };
        
        $scope.scopeVotacao.f.atualizaRestaurante = function(item) {
console.log("entrou " + item);
            $scope.scopeVotacao.restaurante = item;
        };        
        
        //TODO falta pesquisar verificando se ja foi usado nessa semana
        var pesquisarRestaurantesPossiveis = function() {
            if ($scope.scopeVotacao.email != null) {
                RestauranteServicePesquisar.pesquisar({}).$promise
                .then(function(lista) {
                    if (lista.length > 0)
                        $scope.scopeVotacao.listaRestaurantes = lista;
                });
            }
        };
        
        $scope.scopeVotacao.f.salvarVotacao = function() {
            var item = VotacaoServiceListarInserir.inserir(
                {email: $scope.scopeVotacao.email, 
                 restaurante: $scope.scopeVotacao.restaurante, 
                 data:$scope.scopeVotacao.data});
            
            if (item != null) {
                $scope.scopeVotacao._id = item._id;
                $scope.scopeVotacao.email= item.email;
                $scope.scopeVotacao.restaurante= item.restaurante;
                $scope.scopeVotacao.data= item.data;
                $scope.scopeVotacao.liberaTelaVotacao = false;
                //ou
                /*$scope.scopeVotacao._id = null;
                $scope.scopeVotacao.email = null;
                $scope.scopeVotacao.restaurante = null;
                $scope.scopeVotacao.data = geraDataAtual();
                $scope.scopeVotacao.liberaTelaVotacao = null;
                $scope.scopeVotacao.listaRestaurantes = [];
                $scope.scopeVotacao.listaVotacaoHoje = [];*/
                
                //atualizar lista de votados hoje
                atualizaListaVotadosHoje();
            }
        };
        
        //funcao privada
        var atualizaListaVotadosHoje = function() {
            VotacaoServicePesquisar.pesquisar({data: $scope.scopeVotacao.data}).$promise
                .then(function(lista) {
                    if (lista.length > 0)
                        $scope.scopeVotacao.listaVotacaoHoje = lista;
                });
        };
        
        //------------------- funcoes tela restaurante
        
        $scope.scopeRestaurante.f.salvarRestaurante = function() {
            RestauranteServiceListarInserir.inserir({nome:$scope.scopeRestaurante.nome}).$promise
                .then(function(item) {
                    $scope.scopeRestaurante._id = item._id;
                    $scope.scopeRestaurante.nome = item.nome;
                    RestauranteServiceListarInserir.listar().$promise
                        .then(function(lista) {
                            if (lista.length > 0) {
                                $scope.scopeRestaurante.listaRestaurantes = lista;
                                $scope.scopeRestaurante.nome = '';
                            }
                        });
                });
        };
        
        //TODO TESTAR
        $scope.scopeRestaurante.f.listarRestaurante = function() {
            RestauranteServiceListarInserir.listar().$promise
                .then(function(lista) {
                    if (lista.length > 0) {
                        $scope.scopeRestaurante.listaRestaurantes = lista;
                        console.log(lista.length);
                    }
                });  
        };
        
    
        /*
        
        function validaDataVotacao(dataUsuario) {
            var dataHoje = geraDataAtual();
            if (dataUsuario === dataHoje)
                return false;
            
            var diaDaSemana = (new Date()).getDay(); //1 - segunda, 5 - sexta
            if(diaDaSemana === 1)
                return true; //segunda-feira, nao tem galho

            var iUser = parseInt(dataUsuario); //data menor sempre
            var iHoje = parseInt(dataHoje);            
            var diferenca = iHoje - iUser;
            
        }
        
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