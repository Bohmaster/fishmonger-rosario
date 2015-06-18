'use strict';

angular.module('fishMonger')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/views/home.html'
      })
      .state('productos', {
        abstract: true,
        url: '/productos',
        templateUrl: 'app/views/productos/base.html',
        controller: 'ProductosController'
      })

      .state('productos.list', {
        url: '/lista/:page',
        templateUrl: 'app/views/productos/lista.html',
        controller: function($scope, $stateParams, Producto) {
          var limit      = 5;
          var page       = $stateParams.page;

          if (page == "1") {
            var offset = null;
          } else {
            var offset = page * limit - 5;
          }

          $scope.products = [];

          loadPaginatedProducts();

          function loadPaginatedProducts() {
            Producto.find({
              filter: {
                limit: limit,
                offset: offset
              }},
              function(data) {
                $scope.paginatedProducts = data;
              });
            }
          }
        })
      .state('productos.categoria', {
        url: '/:categoriaId',
        templateUrl: 'app/views/productos/categorias.html',
        resolve: {
          SCategorias: function($stateParams, SubCategoria) {
            var categoriaId = parseInt($stateParams.categoriaId);
            return SubCategoria.find({
              filter: {
                where: {
                  categoriaId: categoriaId
                }
              }
            });
          },
          CProductos: function($stateParams, Producto) {
            return Producto.find({
              filter: {
                where: {
                  categoriaId: $stateParams.categoriaId
                }
              }
            });
          }
        },
        controller: function($scope, SCategorias, CProductos) {
          $scope.subCategorias = SCategorias;
          $scope.cProductos = CProductos;
        }
      })
      .state('productos.categoria.sub', {
        url: '/:id',
        templateUrl: 'app/views/productos/productos.html',
        controller: function($rootScope, Producto, $scope, $http, $modal, $stateParams) {
          $scope.subProducts = [];

          var subCategoriaId =  parseInt($stateParams.id);
          function loadSubProducts() {
            Producto.find({
              filter: {
                where: {
                  subCategoriaId: subCategoriaId
                }
              }
            }, function(data) {
              $scope.subProducts = data;
            });
          }

          loadSubProducts();

          $scope.$on('producto.editado', function(event) {
            loadSubProducts();
          })

          $scope.borrarProducto = function(id) {
            Producto.deleteById({id: id},
            function(data) {
              console.log('producto eliminado');
              loadSubProducts();
            })
          }

          $scope.editarProducto = function(id) {
            $modal.open({
              templateUrl: 'app/views/productos/editar.html',
              controller: function(
                $rootScope, $scope, Producto, Categoria, SubCategoria, $stateParams
                ) {
                    $scope.producto = [];
                    $scope.category = [];
                    $scope.subCategoryes = [];
                    $scope.subCategory = [];

                    $scope.editProducto = function() {
                      $http.put('api/productos/' + id, {
                        nombre: $scope.producto.nombre,
                        categoria: $scope.category.nombre,
                        subCategoria: $scope.subCategory.nombre
                      })
                      .then(function(data) {
                          $rootScope.$broadcast('producto.editado');
                          $scope.$close();
                      })
                    }

                    function getProduct() {
                      Producto.findById({id: id},
                        function(data) {
                          $scope.producto = data;
                        });
                    }

                    getProduct();

                    function getCategory() {
                      Categoria.findById({id: $stateParams.categoriaId},
                      function(data) {
                        $scope.category = data;
                        console.log(data);
                      });
                    }

                    getCategory();

                    function getSubCategoryes() {
                      SubCategoria.find({
                        filter: {
                          where: {
                            categoriaId: $stateParams.categoriaId
                          }
                        }
                      }, function(data) {
                        $scope.subCategoryes = data;
                      })
                    }

                    getSubCategoryes();

                    function getSubCategory() {
                      SubCategoria.findById({id: $stateParams.id},
                      function(data) {
                        $scope.subCategory = data;
                      })
                    }

                    getSubCategory();


              }
            });
          }
        }
      });

      $urlRouterProvider.otherwise('home');
  });
