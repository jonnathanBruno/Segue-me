/// <reference path="../../../componentes_sistema/menu.html" />
var model = angular.module('model', ['mwl.calendar','ui.bootstrap','ngTouch','ngAnimate','ngRoute', 'ngMask', 'validacaoModel', 'angularUtils.directives.dirPagination']);
var dominio = window.location.origin + "/";

model.controller('controlador', function ($scope) {
	
	$scope.calendarView = 'month';
	$scope.events = [
	  {
		title: 'My event title', // The title of the event
		type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
		startsAt: new Date(2013,5,1,1), // A javascript date object for when the event starts
		endsAt: new Date(2014,8,26,15), // Optional - a javascript date object for when the event ends
		editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
		deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
		draggable: true, //Allow an event to be dragged and dropped
		resizable: true, //Allow an event to be resizable
		incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
		recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
		cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
	  }
	];
});

model.controller('email', function ($scope) {

    //Pegar querystring
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    $scope.nomeCliente = hashes[0].replace("cliente=", "");
    $scope.path = hashes[1].replace("path=", "");



    $scope.nomeCliente = "Brasprag";

});

model.controller('index', function ($scope) {

    //Saber qual página está no momento para ativar o menu
    $scope.pathname = window.location.pathname;

    $scope.loading = true;

    var dados = JSON.parse(localStorage.getItem('dadosEmpresa'));

    $scope.dadosEmpresa = JSON.parse(dados);
    $scope.dadosEmpresa["pathLogo"] = localStorage.getItem('pathLogo');

    console.log($scope.dadosEmpresa);

    if ($scope.dadosEmpresa == null) {
        location.href = "login.html";
    }

    //Função para sair do sistema
    $scope.sair = function () {
        //localStorage.removeItem('dadosEmpresa');
        localStorage.clear();
        location.href = "Login.html?empresa=" + $scope.dadosEmpresa.Dominio;
    }

    $scope.loading = false;

}).directive('menu', function () {
    return {
        templateUrl: 'componentes_sistema/menu.html'
    };
});

model.controller('inserirCliente', function ($scope, $q, $timeout, $http) {

    $scope.dadosClienteInserir = {};

    $scope.uploadLogomarca = function () {

        var def = $q.defer();

        $timeout(function () {
            // Mock a delayed response
            //Upload de comprovante
            var req = new XMLHttpRequest(); // Cria requisicao

            // Pega arquivo
            var file = document.getElementById("logomarca").files[0];

            if (file == undefined) {
                $scope.dadosClienteInserir["logomarca"] = "logopadrao.png";
                $scope.inserirCliente();
                return;
            }

            // Prepara dados
            var fd = new FormData();
            fd.append("upload", file);
			if($scope.dadosClienteInserir.nome == 'undefined'){
				fd.append("pastaEmpresa", $scope.dadosClienteInserir["Nome_fantasia"]);
			}else{
				fd.append("pastaEmpresa", $scope.dadosClienteInserir["nome"]);
			}
			
            req.open("POST", dominio + "/Sistema/Logica_Cliente/Cliente.asmx/UploadFile", false); // Abre conexão
            req.send(fd); // Envia para o servidor
            def.resolve();


            $scope.dadosClienteInserir["logomarca"] = file.name;
            $scope.inserirCliente();


        }, 500);

        return def.promise;

    }

    //Função para inserir pessoa fisica
    $scope.inserirCliente = function () {

        $scope.loading = true;

        $scope.dadosClienteInserir["id_empresa_responsavel"] = $scope.dadosEmpresa.Id_Empresa;


        //Saber qual o grau da empresa, se é o a gente ou se é um cliente nosso... (UR=1)
        $scope.dadosClienteInserir["tipo_empresa"] = $scope.dadosEmpresa.Tipo_empresa;

        //Inserir pessoa fisica
        $.ajax({
            type: "POST",
            url: dominio + "/Sistema/Logica_Cliente/Cliente.asmx/InserirCliente",
            dataType: "json",
            async: false,
            //async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                entrada: JSON.stringify($scope.dadosClienteInserir)
            }),
            success: function (data) {

                if (data.d != 'Erro') {
					
                    $scope.inserirModulos();

                    $('#modalInserirUsuario').modal('toggle');
                    $('#modalInserirUsuario').modal('show');

                    $scope.loading = false;

                } else {
                    $scope.erroEncontrarEmpresa = true;
                    $scope.loading = false;
                }

            },
            error: function () {
                location.href = "erro/erro.html";
                $scope.loading = false;
            }
        });

    }


    // função endereço 
    $scope.getEndereco = function () {

        var cep = ($('#cep').val());

        if (cep.length > 8) {

            $scope.loading = true;

            $.getScript("http://cep.republicavirtual.com.br/web_cep.php?formato=javascript&cep=" + cep, function () {

                $scope.loading = true;

                if (resultadoCEP["resultado"] == 1) {
                    $scope.dadosClienteInserir.rua = unescape(resultadoCEP["logradouro"]);
                    $scope.dadosClienteInserir.tipo = unescape(resultadoCEP["tipo_logradouro"]);
                    $scope.dadosClienteInserir.bairro = unescape(resultadoCEP["bairro"]);
                    $scope.dadosClienteInserir.cidade = unescape(resultadoCEP["cidade"]);
                    $scope.dadosClienteInserir.estado = unescape(resultadoCEP["uf"]);
                }


            });
        }


    }
    // função endereço

    //Função para inserir pessoa jurídica
    $scope.inserirCliente = function () {

        $scope.loading = true;

        $scope.dadosClienteInserir["id_empresa_responsavel"] = $scope.dadosEmpresa.Id_Empresa;
        //Saber qual o grau da empresa, se é o a gente ou se é um cliente nosso... (UR=1)
        $scope.dadosClienteInserir["tipo_empresa"] = $scope.dadosEmpresa.Tipo_empresa;

        //Inserir pessoa fisica
        $.ajax({
            type: "POST",
            url: dominio + "/Sistema/Logica_Cliente/Cliente.asmx/inserirCliente",
            dataType: "json",
            async: false,
            //async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                entrada: JSON.stringify($scope.dadosClienteInserir)
            }),
            success: function (data) {

                if (data.d != 'Erro') {

                    $scope.inserirModulos();
                    $('#modalInserirUsuario').modal('toggle');
                    $('#modalInserirUsuario').modal('show');

                    $scope.loading = false;

                } else {
                    $scope.erroEncontrarEmpresa = true;
                    $scope.loading = false;
                }

            },
            error: function () {
                location.href = "erro/erro.html";
                $scope.loading = false;
            }
        });

    }

    //Função para inserir modulos para o cliente após de inserir o ultimo cliente
    $scope.inserirModulos = function () {

        $.ajax({
            type: "POST",
            url: dominio + "/Sistema/Logica_Cliente/Cliente.asmx/inserirModulos",
            dataType: "json",
            async: false,
            //async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                entrada: JSON.stringify($scope.dadosClienteInserir)
            }),
            success: function (data) {

                if (data.d != 'Erro') {

                } else {
                    $scope.erroEncontrarEmpresa = true;
                }

            },
            error: function () {
                location.href = "erro/erro.html";
            }
        });

    }


});

model.controller('listarClientes', function ($scope, $http) {

    $scope.loading = true;
    $scope.pesquisandoCliente = false;

    //Listar clientes
    $.ajax({
        type: "POST",
        url: dominio + "/Sistema/Logica_Cliente/Cliente.asmx/listarTodosClientes",
        dataType: "json",
        async: false,
        //async: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            entrada: JSON.stringify($scope.dadosEmpresa)
        }),
        success: function (data) {
            if (data.d != 'Erro') {
                var dados = JSON.parse(data.d);
                $scope.TodosOsClientes = dados;
                $scope.TodosOsClientes["pathLogo"] = "arquivos_empresa//empresas//";
                console.log($scope.TodosOsClientes);
                $scope.loading = false;
            } else {
                $scope.loading = false;
            }
        },
        error: function () {
            location.href = "erro/erro.html";
        }
    });

    $scope.detalheCliente = function (id) {
        location.href = "detalhe_cliente.html?idCliente=" + id;
    }

    $scope.popUpExcluirUsuario = function (id) {

        localStorage.setItem("idExcluirUsuario", id);

        $('#modalExcluirUsuario').modal('toggle');
        $('#modalExcluirUsuario').modal('show');
    }

    $scope.confirmarExclusaoUsuario = function () {

        $scope.dadosEmpresa["Id_Cliente"] = localStorage.getItem("idExcluirUsuario");

        //Excluir usuário
        $.ajax({
            type: "POST",
            url: dominio + "/Sistema/Logica_Cliente/Cliente.asmx/excluirUsuario",
            dataType: "json",
            async: false,
            //async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                entrada: JSON.stringify($scope.dadosEmpresa)
            }),
            success: function (data) {

                if (data.d != 'Erro') {

                    localStorage.removeItem("idExcluirUsuario");
                    location.href = "todos_clientes.html";

                } else {

                    $scope.loading = false;
                }

            },
            error: function () {
                location.href = "erro/erro.html";
                $scope.loading = false;
            }
        });



    }


    //Autocomplete pesquisar cliente
    $scope.pesquisarClienteAutoComplete = function () {

        //Variavel para aparecer o título de Resultado da pesquisa...
        $scope.pesquisandoCliente = true;
        $scope.dadosEmpresa["nomeClientePesquisar"] = $scope.pesquisarCliente;

        $.ajax({
            type: "POST",
            url: dominio + "/Sistema/Logica_Cliente/Cliente.asmx/pesquisarClienteAutoComplete",
            dataType: "json",
            async: false,
            //async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                entrada: JSON.stringify($scope.dadosEmpresa)
            }),
            success: function (data) {

                if (data.d != 'Erro') {

                    var dados = JSON.parse(data.d);
                    $scope.TodosOsClientes = dados;
                    $scope.TodosOsClientes["pathLogo"] = "arquivos_empresa//empresas//";
                    $scope.loading = false;

                } else {

                    $scope.loading = false;
                }

            },
            error: function () {
                location.href = "erro/erro.html";
                $scope.loading = false;
            }
        });


    }

});

model.controller('detalheCliente', function ($scope) {

    //Pegar querystring
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var idCliente = hashes[0].replace("idCliente=", "");

    $scope.loading = true;

    if (idCliente.indexOf("#") != -1) {
        $scope.dadosEmpresa["Id_Cliente"] = idCliente.split("#")[0];
    }
    else {
        $scope.dadosEmpresa["Id_Cliente"] = idCliente;
    }


    //Detalhe do cliente
    $.ajax({
        type: "POST",
        url: dominio + "/Sistema/Logica_Cliente/Cliente.asmx/detalheCliente",
        dataType: "json",
        async: false,
        //async: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            entrada: JSON.stringify($scope.dadosEmpresa)
        }),
        success: function (data) {

            if (data.d != 'Erro') {

                var dados = JSON.parse(data.d);
                $scope.dadoDetalheCliente = dados;
                $scope.dadoDetalheCliente["pathLogo"] = "arquivos_empresa/empresas/";

                console.log($scope.dadoDetalheCliente);
                if ($scope.dadoDetalheCliente[0].Cnpj == null) {
                    $scope.pessoaFisica = true;
                }
                else {
                    $scope.pessoaFisica = false;
                }

            } else {

                $scope.loading = false;
            }

        },
        error: function () {
            location.href = "erro/erro.html";
            $scope.loading = false;
        }
    });

    //Excluir cliente
    $scope.popUpExcluirUsuario = function () {

        //Pegar querystring
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        var idCliente = hashes[0].replace("idCliente=", "");

		idCliente = idCliente.split("#");
        localStorage.setItem("idExcluirUsuario", idCliente[0]);

        $('#modalExcluirUsuario').modal('toggle');
        $('#modalExcluirUsuario').modal('show');
    }

    $scope.confirmarExclusaoUsuario = function () {

        $scope.dadosEmpresa["Id_Cliente"] = localStorage.getItem("idExcluirUsuario");

        //Excluir usuário
        $.ajax({
            type: "POST",
            url: dominio + "/Sistema/Logica_Cliente/Cliente.asmx/excluirUsuario",
            dataType: "json",
            async: false,
            //async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                entrada: JSON.stringify($scope.dadosEmpresa)
            }),
            success: function (data) {

                if (data.d != 'Erro') {

                    localStorage.removeItem("idExcluirUsuario");
                    location.reload();

                } else {

                    $scope.loading = false;
                }

            },
            error: function () {
                location.href = "erro/erro.html";
                $scope.loading = false;
            }
        });



    }

    $scope.alterarCliente = function () {

        $scope.loading = true;

        $scope.dadoDetalheCliente[0]["tipo_empresa"] = $scope.dadosEmpresa.Tipo_empresa;

        $.ajax({
            type: "POST",
            url: dominio + "/Sistema/Logica_Cliente/Cliente.asmx/alterarCliente",
            dataType: "json",
            async: false,
            //async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                entrada: JSON.stringify($scope.dadoDetalheCliente[0])
            }),
            success: function (data) {

                if (data.d != 'Erro') {

                    $scope.loading = false;
                    $('#modalAlterarCliente').modal('toggle');
                    $('#modalAlterarCliente').modal('show');

                } else {

                    $scope.loading = false;
                }

            },
            error: function () {
                location.href = "erro/erro.html";
                $scope.loading = false;
            }
        });

    }


    //Pegar modulos deste cliente... No detalhe do cliente...
    $scope.pegarModulosCliente = function () {

        var entrada = {
            Id_Cliente: $scope.dadoDetalheCliente[0].id
        };

        $.ajax({
            type: "POST",
            url: dominio + "/Sistema/Logica_Cliente/Cliente.asmx/pegarModulosCliente",
            dataType: "json",
            async: false,
            //async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                entrada: JSON.stringify(entrada)
            }),
            success: function (data) {

                if (data.d != 'Erro') {

                    var dados = JSON.parse(data.d);
                    $scope.dadosClienteInserir = dados;
                    for (var i = 0; i < dados.length; i++) {
                        if (dados[i].modulo == 'Financeiro') {
                            $scope.dadosClienteInserir.financeiro = true;
                        }
                        if (dados[i].modulo == 'Controle_de_cliente') {
                            $scope.dadosClienteInserir.clientes = true;
                        }
                        if (dados[i].modulo == 'Agenda_de_servicos') {
                            $scope.dadosClienteInserir.servicos = true;
                        }
                    }
                    $scope.loading = false;


                } else {
                    //TODO mostrar modal de erro
                    $scope.loading = false;
                }

            },
            error: function () {
                location.href = "erro/erro.html";
                $scope.loading = false;
            }
        });

    }


    //Pegar modulos deste cliente... No detalhe do cliente...
    $scope.alterarConfiguracoes = function () {


        if ($scope.dadosClienteInserir.financeiro) {
            $scope.dadoDetalheCliente[0].modulo1 = 'Financeiro';
        }
        if ($scope.dadosClienteInserir.servicos) {
            $scope.dadoDetalheCliente[0].modulo2 = 'Agenda_de_servicos';
        }
        if ($scope.dadosClienteInserir.clientes) {
            $scope.dadoDetalheCliente[0].modulo3 = 'Controle_de_cliente';
        }
        $.ajax({
            type: "POST",
            url: dominio + "/Sistema/Logica_Cliente/Cliente.asmx/alterarConfiguracoes",
            dataType: "json",
            async: false,
            //async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                entrada: JSON.stringify($scope.dadoDetalheCliente[0])
            }),
            success: function (data) {

                if (data.d != 'Erro') {

                    //var dados = JSON.parse(data.d);
                    //$scope.dadoModulos = dados;
                    $scope.loading = false;
                    $('#modalAlterarConfiguracao').modal('toggle');
                    $('#modalAlterarConfiguracao').modal('show');



                } else {
                    //TODO mostrar modal de erro
                    $scope.loading = false;
                }

            },
            error: function () {
                location.href = "erro/erro.html";
                $scope.loading = false;
            }
        });

    }

});

model.controller('login', function ($scope) {


    //Limpar tudo do localstorage
    localStorage.removeItem("dadosEmpresa");
    localStorage.removeItem("pathLogo");

    //Variavel para aparecer o erro, caso a empresa não exista na base de dados...
    $scope.erroEncontrarEmpresa = false;
    $scope.empresaInativo = false;
    $scope.redefinirSenha = false;
    $scope.loading = true;
    $scope.senhaFraca = 0;
    $scope.senhaIgual = 0;

    //Pegar querystring
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    if (hashes.length == 2) {
        $scope.empresaNome = hashes[0].replace("empresa=", "");
        $scope.redefinirSenha = hashes[1].replace("redefinirSenha=", "");
        $scope.redefinirSenha = true;
    }
    else {
        $scope.empresaNome = hashes[0].replace("empresa=", "");
        $scope.redefinirSenha = false;
    }

    $scope.medirForcaSenha = function () {

        var novasenha = $('#novaSenha').val();
        if (novasenha.length <= 6 && novasenha.length > 0) {
            $scope.senhaFraca = 1;
        }
        else if (novasenha.length <= 8 && novasenha.length > 0) {
            $scope.senhaFraca = 2;
        }
        else if (novasenha.length > 10 && novasenha.length > 0) {
            $scope.senhaFraca = 3;
        }

    }

    $scope.confirmarSenhaIgual = function () {
        var confirmarSenha = $('#confirmarSenha').val();
        var novasenha = $('#novaSenha').val();

        if (confirmarSenha != novasenha && novasenha.length > 0) {
            $scope.senhaIgual = 1;
        }
        if (confirmarSenha == novasenha && novasenha.length > 0) {
            $scope.senhaIgual = 2;
        }


    }

    var entrada = {
        email: '',
        senha: '',
        dominio: $scope.empresaNome
    }

    //Pegar informações da empresa
    $.ajax({
        type: "POST",
        url: dominio + "/Sistema/Logica_Login/Login.asmx/pegarInformacoesEmpresa",
        dataType: "json",
        async: false,
        //async: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            entrada: JSON.stringify(entrada)
        }),
        success: function (data) {

            if (data.d != 'Erro') {

                var dados = JSON.parse(data.d);
                $scope.dadosEmpresa = dados;
                $scope.dadosEmpresa["redefinirSenha"] = $scope.redefinirSenha;
                $scope.dadosEmpresa["pathLogo"] = "arquivos_empresa\\Empresas\\";
                $scope.loading = false;


            } else {
                $scope.erroEncontrarEmpresa = true;
                $scope.loading = false;

            }

        },
        error: function () {
            location.href = "erro/erro.html";
        }
    });


    //Variavel para aparecer o erro no login, caso o usuário erro o login...
    $scope.erroLogin = false;

    //Função para efetuar login...
    $scope.fazerLogin = function () {

        if ($scope.redefinirSenha) {

            $scope.dadosEmpresa["novaSenha"] = $('#novaSenha').val();

            var entrada = {
                id: $scope.dadosEmpresa[0].Id_Empresa,
                novaSenha: $scope.dadosEmpresa.novaSenha,
                dominio: $scope.dadosEmpresa[0].Dominio
            };

            //Criar senha senha aqui
            $.ajax({
                type: "POST",
                url: dominio + "/Sistema/Logica_Login/Login.asmx/criarSenha",
                dataType: "json",
                //async: false,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    entrada: JSON.stringify(entrada)
                }),
                success: function (data) {

                    if (data.d != 'Erro') {

                        $('#modalSenhaCriadaComSucesso').modal('toggle');
                        $('#modalSenhaCriadaComSucesso').modal('show');


                    } else {
                        $scope.erroLogin = true;
                        $scope.$apply();
                    }

                },
                error: function () {
                    location.href = "erro/erro.html";
                }
            });


        } else {

            var entrada = {
                email: $scope.email,
                senha: $scope.senha,
                dominio: $scope.empresaNome
            }
            //Fazer login aqui...
            $.ajax({
                type: "POST",
                url: dominio + "/Sistema/Logica_Login/Login.asmx/fazerLogin",
                dataType: "json",
                //async: false,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    entrada: JSON.stringify(entrada)
                }),
                success: function (data) {

                    if (data.d == 'Inativo') {
                        $scope.empresaInativo = true;
                        $scope.$apply();
                        return;
                    }


                    if (data.d != 'Erro') {

                        var dados = JSON.stringify(data.d);
                        localStorage.setItem('dadosEmpresa', dados);
                        localStorage.setItem('pathLogo', "arquivos_empresa\\Empresas\\");


                        location.href = "index.html";

                    } else {
                        $scope.erroLogin = true;
                        $scope.$apply();
                    }

                },
                error: function () {
                    location.href = "erro/erro.html";
                }
            });
        }
    }

    $scope.acessarOSistema = function () {
        location.href = "login.html?empresa=" + $scope.dadosEmpresa[0].Dominio;
    }

    $scope.enviarEmailEsqueciSenha = function () {

        $.ajax({
            type: "POST",
            url: dominio + "/Sistema/Logica_Cliente/Cliente.asmx/enviarEmailEsqueciSenha",
            dataType: "json",
            //async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                entrada: JSON.stringify($scope.emailModal)
            }),
            success: function (data) {

                if (data.d != 'Erro') {
                    $scope.emailInvalido = false;
                } else {
                    $scope.emailInvalido = true;
                    $scope.$apply();
                }

            },
            error: function () {
                alert("Erro ao conectar com servidor.");
            }
        });
    }

});

model.controller('financeiro', function ($scope) {

    $scope.receita = true;
    $scope.despesa = false;


    $scope.selecionarTipoConta = function (tipo) {

        if (tipo == 'receita') {
            $scope.receita = true;
            $scope.despesa = false;
        }
        else {
            $scope.despesa = true;
            $scope.receita = false;
        }

    }

    $scope.cadastrarConta = function () {


        if ($scope.despesa) {
            $scope.inserirConta["categoriaConta"] = "despesa";
        } else {
            $scope.inserirConta["categoriaConta"] = "receita";
        }
        $scope.inserirConta["idEmpresaResponsavel"] = $scope.dadosEmpresa.id;

        //Pegar informações da empresa
        $.ajax({
            type: "POST",
            url: dominio + "/Sistema/Logica_Financeiro/Financeiro.asmx/inserirConta",
            dataType: "json",
            async: false,
            //async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                entrada: JSON.stringify($scope.inserirConta)
            }),
            success: function (data) {

                if (data.d != 'Erro') {

                    alert("Ok");

                } else {
                    //mostrar alerta
                    alert("Erro");
                }

            },
            error: function () {
                location.href = "erro/erro.html";
            }
        });

    }

});


//////////////////////////Controladores para paginação///////////////////////////////////q


function paginacao($scope) {

    $scope.currentPage = 1;
    $scope.pageSize = 5;

}

function OtherController($scope) {
    $scope.pageChangeHandler = function (num) {
        console.log('going to page ' + num);
    };
}

model.controller('paginacao', paginacao);
model.controller('OtherController', OtherController);