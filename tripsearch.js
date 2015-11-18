var app = angular.module('app', []);

app.config(function($compileProvider) {
	if (!location.host.match(/^local/)) {
		// Disabled in production for performance boost
		$compileProvider.debugInfoEnabled(false);
	}
});

app.config(function($httpProvider) {
	// Enable async HTTP for performance boost
	$httpProvider.useApplyAsync(true);
});

app.controller('searchController', function($scope, $http, $window) {
	$scope.query = '';
	$scope.searched = false; // Whether we have done at least one search
	$scope.loading = false;
	$scope.result;

	$scope.submit = function() {
		$scope.loading = true;

		$http({
			method: 'GET',

			// This URL is fine if you have direct access to the TripDatabase server (i.e. running from local host)
			url: 'https://www.tripdatabase.com/search/json',

			// Otherwise you will need to proxy via internal PHP
			// url: '/proxytrip.php',

			params: {criteria: $scope.query},
		})
			.then(function(res) {
				$scope.result = res.data;
			})
			.finally(function() {
				$scope.searched = true;
				$scope.loading = false;
			});
	};

	$scope.debugLoading = function() {
		$scope.loading = !$scope.loading;
	};

	// Load initial state from URL
	if (/^\?q=/.test($window.location.search)) {
		$scope.query = decodeURIComponent($window.location.search.substr(3));
		$scope.submit();
	}
});
