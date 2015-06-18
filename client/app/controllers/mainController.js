'use strict';

angular.module('fishMonger')
  .controller('MainController', function($rootScope, $scope, Producto, Evento) {

    // main config

    $scope.productos = [];

    // init

    loadProductos();
    loadEventos();

    // load data

    function loadProductos() {
      Producto.find({
        filter: {
          limit: 8
        }
      }, function(data) {
          $scope.productos = data;
      });
    }

    function loadEventos() {
      Evento.find(function(data) {
      })
    }


  });
