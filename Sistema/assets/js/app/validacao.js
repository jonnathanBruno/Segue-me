var validacao = angular.module('validacaoModel', []);
var dominio = window.location.origin + "/";

//var dominio = "http://1bc8e10c.ngrok.com";
validacao.directive('validarDominio', function ($q, $timeout) {

    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$asyncValidators.checarDominio = function (modelValue, viewValue) {

                //if (ctrl.$isEmpty(modelValue)) {
                //    // consider empty model valid
                //    return $q.when();
                //}

                var def = $q.defer();

                $timeout(function () {
                    // Mock a delayed response

                    var entrada = {
                        'dominio': $('#dominio').val(),
                    }

                    $.ajax({
                        type: "post",
                        url: dominio + "Sistema/Logica_Cliente/Cliente.asmx/verificarDominioExiste",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            entrada: JSON.stringify(entrada)
                        }),
                        success: function (data) {

                            if (data.d != 'Erro') {
                                def.resolve();
                            }
                            else {
                                def.reject();
                            }
                        },
                        error: function () {
                            def.reject();
                        }
                    });

                }, 2000);

                return def.promise;

            }
        }
    }

})



//var dominio = "http://1bc8e10c.ngrok.com";
.directive('validarDominioCliente', function ($q, $timeout) {

    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$asyncValidators.checarDominioCliente = function (modelValue, viewValue) {

                //if (ctrl.$isEmpty(modelValue)) {
                //    // consider empty model valid
                //    return $q.when();
                //}
                scope.erroDominio = false;

                var def = $q.defer();

                $timeout(function () {
                    // Mock a delayed response

                    var entrada = {
                        'dominio': $('#dominio').val(),
                    }

                    $.ajax({
                        type: "post",
                        url: dominio + "Sistema/Logica_Cliente/Cliente.asmx/verificarDominioExisteCliente",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            entrada: JSON.stringify(entrada)
                        }),
                        success: function (data) {

                            if (data.d != 'Erro') {
                                def.resolve();
                                //scope.erroDominio = false;
                            }
                            else {
                                //def.reject();
                                scope.erroDominio = true;
                            }
                        },
                        error: function () {
                            def.reject();
                        }
                    });

                }, 2000);

                return def.promise;

            }
        }
    }

});