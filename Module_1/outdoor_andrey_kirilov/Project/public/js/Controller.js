var validationApp = angular.module('validationApp', []);


validationApp.controller('mainController', ['$scope','$http', '$window', '$location', function($scope, $http, $window, $location) {
    $scope.user = {};
    $scope.more = 'More';
    $scope.auth1 = '';

    $scope.saveData = function() {
        $scope.nameRequired = '';
        $scope.emailRequired = '';
        $scope.passwordRequired = '';
        if (!$scope.user.username) {
            $scope.nameRequired = 'Name Required';
        }

        if (!$scope.user.email) {
                $scope.emailRequired = 'Email Required';
        }

        if (!$scope.user.password) {
                $scope.passwordRequired = 'Password Required';
        }
        $http.post('/register', $scope.user).then(function(response, err){
            if(err) {
                $("#myModal3").modal("show");
            }
            else {
                $("#myModal_registration").modal("show");
            }
        })
    };
    $scope.open_log = function(){
        $("#myModal_reg").modal("hide");
        $("#myModal").modal("show");
    }
    $scope.userlogin = function(){
        $http({
            method: "get",
            url:'/loggedin'
        }).then(function(response, err){

        }).catch(function(err) {
            $("#myModal2").modal("show");
        });
        $http({
            method:"post",
            url:'/login',
            data:{username:$scope.username, password:$scope.password},
        }).then(function(response, err){
            $scope.userData = response;
            $("#myModal4").modal("show");

        })
    };
    $scope.Login_true = function(){
        $window.location.href = '/index.html';
    }


}]);


