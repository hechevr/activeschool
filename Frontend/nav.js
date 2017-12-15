app.controller('navController', function($scope, $window, $cookies) {
    $scope.Logout = function() {
        $http.post('/users/logout', {})
        .then(function logoutSuccess(response) {
            console.log(response);
            $cookies.remove('uid');
            $window.location.href = '/';
        });
    };
});