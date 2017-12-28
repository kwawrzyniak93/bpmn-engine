(function(){
    'use strict'

    angular.module('app', []);

    angular.module('app')
        .controller('mainController', ['$scope', mainController])

    function mainController($scope){
        $scope.departs = [];
        $scope.tasks = [];
        $scope.departs.push({ name: 'HR', tasks:[]})
        $scope.departs.push({ name: 'IT', tasks:[]})
        $scope.addDepart=function(){
            $scope.departs.push({name: $scope.departName, tasks: []})
        }

        $scope.deleteDepart=function(index){
            var newarr = [];
            for(var i = 0; i < $scope.departs.length; i++){
                if(i != index){
                    newarr.push($scope.departs[i]);
                }
            }
            $scope.departs = newarr;
        }

        $scope.addTask = function(index){
            $scope.departs[index].tasks.push($scope.tasks[index]);
        }
    }
})()