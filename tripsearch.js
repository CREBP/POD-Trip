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

app.controller('searchController', function($scope, $http, $location, $window) {
	$scope.query = '';
	$scope.searched = false; // Whether we have done at least one search
	$scope.loading = false;
	$scope.result;

	$scope.submit = function() {
		$scope.loading = true;

		window.location.hash = '?q=' + $scope.query;

		$http({
			method: 'GET',
			url: '/proxytrip.php', // Route via proxy to work around CORS limits from Trip
			params: {criteria: $scope.query},
		})
			.then(function(res) {
				$scope.result = res.data;
				// Decorators {{{
				$scope.result.documents = $scope.result.documents.map(function(r) {
					// Prettify dates {{{
						r.pubdate = moment(r.pubdate).format('dddd MMMM do YYYY');
						return r;
					// }}}
				})
				// }}}
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
	if (/^\?q=/.test($window.location.search)) { // Import from GET
		$scope.query = decodeURIComponent($window.location.search.substr(3));
		$scope.submit();
	} else if ($location.search().q) { // Import from location.hash (as GET style query)
		$scope.query = $location.search().q;
		$scope.submit();
	}
});
