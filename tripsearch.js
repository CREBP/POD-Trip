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
	$scope.limitOverdiag = true; // Limit results to overdiagnosis only
	$scope.searched = false; // Whether we have done at least one search
	$scope.loading = false;
	$scope.result;
	$scope.pages = {current: 9, total: null, previous: [], next: []};

	$scope.submit = function() {
		$scope.loading = true;

		window.location.hash = '?q=' + $scope.query + '&page=' + $scope.pages.current;

		$http({
			method: 'GET',
			url: '/proxytrip.php', // Route via proxy to work around CORS limits from Trip
			params: {
				page: $scope.pages.current,
				criteria: $scope.query + ($scope.limitOverdiag ? ' tag:OV' : ''),
			},
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
				// Pagination {{{
				$scope.pages.total = Math.ceil($scope.result.total / $scope.result.count);
				$scope.pages.previous = [];
				for (var p = $scope.pages.current - 1; p > 0 && p > $scope.pages.current - 5; p--) {
					$scope.pages.previous.push(p);
				}
				$scope.pages.previous.reverse();

				$scope.pages.next = [];
				for (var p = $scope.pages.current + 1; p < $scope.pages.current + 5; p++) {
					if (p > $scope.pages.total) break;
					$scope.pages.next.push(p);
				}
				// }}}
				// }}}
			})
			.finally(function() {
				$scope.searched = true;
				$scope.loading = false;
			});
	};

	$scope.setPage = function(pageNo) {
		$scope.pages.current = pageNo;
		$scope.submit();
	};

	// Load initial state from URL
	if (/^\?q=/.test($window.location.search)) { // Import from GET
		$scope.query = decodeURIComponent($window.location.search.substr(3));
		$scope.submit();
	} else if ($location.search().q) { // Import from location.hash (as GET style query)
		$scope.query = $location.search().q;
		$scope.pages.current = $location.search().page ? parseInt($location.search().page) : 1;
		$scope.submit();
	}
});
