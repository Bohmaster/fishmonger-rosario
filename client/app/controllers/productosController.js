'use strict';

angular.module('fishMonger')
.controller('ProductosController', function(
  $rootScope, $scope, $stateParams, Producto, Categoria, SubCategoria, $modal
  ) {

  /**
  * PRODUCTO CONFIGURATION
  **/

  // init

  $scope.productos = {};
  $scope.categorias = [];
  $scope.subCategorias = [];

  // public methods

  $scope.addProduct = function() {
    $modal.open({
      templateUrl: 'app/views/productos/add.html',
      controller: 'ProductosController'
    });
  }

  $scope.addProducto = function() {
    var categoriaId = parseInt($scope.producto.categoria.charAt(0));
    var subCategoriaId = parseInt($scope.producto.subCategoria.charAt(0));

    Producto.create({
      nombre: $scope.producto.nombre,
      categoriaId: categoriaId,
      subCategoriaId: subCategoriaId
    }, function(data) {
      console.log("producto " + data.id + " creado");
      $rootScope.$broadcast('producto.creado')
    });
  }

  $scope.$on('producto.creado', function(event) {
    loadProductos();
    countProductos();
  })

  // loaders

  function countProductos() {
    Producto.count(function(data) {
      totalCount = data.count;
      pages = totalCount / limit;

      for	(var index = 0; index < pages; index++) {
        var _page = index + 1;
        $scope.pages.push(_page.toString());
      }

    });
  }

  function loadProductos() {
    Producto.find(function(data) {
      $scope.productos = data;
    });
    countProductos();
  }

  loadProductos();

  function loadCategorias () {
    Categoria.find(function(data) {
      $scope.categorias = data;
      console.log(data);
    });
  }

  loadCategorias();

  function loadSubCategorias () {
    SubCategoria.find(function(data) {
      $scope.subCategorias = data;
    });
  }

  loadSubCategorias();

  /**
  * PAGINATION ALGORITHM
  **/
  var totalCount = null;
  var pages      = null;
  var limit      = 5;

  $scope.page = 1;

  $scope.pages = []

  $scope.changePage = function(n) {
    console.log(n);
    $scope.page = n;
  }

});
