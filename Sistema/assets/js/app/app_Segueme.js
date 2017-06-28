var model = angular.module('Segueme', ['ngMask']);
var dominio = window.location.origin + "/";



model.controller('seguemeController', function ($scope, $http, $rootScope) {

   
    $scope.listarSeguidor = function () {
        $http.post("/Sistema/SERVIDOR/segueme.asmx/listarSeguidor", {}).success(function (data) {
            $scope.loading = false;
            if (data.d != 'Erro') {
                $scope.seguidores = JSON.parse(data.d);
            } else {
                location.href = "erro/erro.html";
            }
        });
    }

    $scope.listarSeguidorEquipe = function () {
        $http.post("/Sistema/SERVIDOR/segueme.asmx/listarSeguidorEquipe", {}).success(function (data) {
            $scope.loading = false;
            if (data.d != 'Erro') {
                $scope.seguidoresE = JSON.parse(data.d);
            } else {
                location.href = "erro/erro.html";
            }
        });
    }

    $scope.cadastrarSeguidor = function (seguidor) {
        $scope.loading = true;

        $http.post("/Sistema/SERVIDOR/segueme.asmx/cadastrarSeguidor", { seguidor: JSON.stringify(seguidor) }).success(function (data) {
            $scope.loading = false;
            if (data.d == "Ok") {
                $('#modalSeguidorCadastrado').modal('toggle');
                $('#modalSeguidorCadastrado').modal('show');
            } else {
                location.href = "erro/erro.html";
            }
        });
    }

    $scope.cadastrarSeguidorNaEquipe = function (seguidor) {
        $scope.loading = true;

        seguidor["idSeguidor"] = seguidor.seg.idSeguidor;
        $http.post("/Sistema/SERVIDOR/segueme.asmx/cadastrarSeguidorNaEquipe", { seguidorEquipe: JSON.stringify(seguidor) }).success(function (data) {
            $scope.loading = false;
            if (data.d == "Ok") {
                $('#modalSeguidorCadastrado').modal('toggle');
                $('#modalSeguidorCadastrado').modal('show');
            } else {
                location.href = "erro/erro.html";
            }
        });
    }
   

}).directive('menu', function () {
    return {
        templateUrl: 'componentes_sistema/menu.html'
    };
});

model.controller('fluxoCaixa', function ($scope) {

});

model.controller('financeiro', function ($scope) {

});

//////////////////////////Controladores para pagina��o///////////////////////////////////q

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
