'use strict';

angular.module('fishMonger')
  .controller('NoticiasController', function($rootScope, $scope, Evento, $modal) {
    $scope.eventos = [];

    function loadEventos() {
      Evento.find({
        filter: {
          limit: 5
        }
      }, function(data) {
        $scope.eventos = data;
      });
    }
  })
