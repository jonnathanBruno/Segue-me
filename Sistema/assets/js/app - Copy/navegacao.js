angular.module('model')
    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'views/inicio.html',
                controller: 'inicio'
            })
            .otherwise('/', {
                templateUrl: 'index.html#/dadosPessoais',
                controller: 'dadosPessoais'
            });

    }]);