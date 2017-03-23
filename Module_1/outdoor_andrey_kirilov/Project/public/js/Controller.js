var validationApp = angular.module('validationApp', []);

validationApp.controller('mainController', ['$scope','$http', '$window', function($scope, $http, $window) {
    $scope.button = 'Join us';
    $scope.user = {};
    $scope.log_users = {};
    $scope.loguser = {};
    $scope.link = '#';


    $scope.more = 'More';
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

        $http.post('/register', $scope.user).then(function(response){
            console.log('get data from server');
            alert('Successful');
            $window.location.href = '/index.html';


    })
    console.log('Data sended');
    };

    $scope.loggIn = function () {
        console.log('started');
        console.log('I will give this data to server '+$scope.loguser)
        $http({ url: '/login', method: 'GET', params: {login:$scope.loguser.login, pass:$scope.loguser.pass}
        }).then(function(result, error, user) {

            $scope.user = result.rows[0];
            console.log('Password, taken from server '+$scope.user.password);
             //access returned res here
            console.log('username, taken from server '+$scope.user.user_account);
            console.log('Entered username ' + $scope.loguser.login + ' Entered password ' + $scope.loguser.pass)
//            console.log('1488'+$scope.hash1);

            }, function(error) {
                console.log('Error in http$get');

        });

        if($scope.loguser.login == $scope.user.user_account){
            alert('Logged in');
            $window.location.href = '/index.html';
        }
        if($scope.loguser.login !== $scope.user.user_account){
            alert('Incorrect login or password');
        }
//        else {
//            alert('Incorrect login or password')
//            console.log('failed');
////            $window.location.href = '/index.html';
//        }
    };
}]);

