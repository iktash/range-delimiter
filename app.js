var app = angular.module("budget", ["range-delimiter"]);

app.filter("cropZeros", function() {
    return function(input) {
        return input.replace(/0$|\.00$/, "");
    }
});

app.directive("grow", function() {
    return {
        restrict: "A",
        scope: {
            grow: "="
        },
        link: function(scope, elem, attrs) {
            scope.$watch("grow", function(new_value) {
                elem.css("flex-grow", new_value);
            });
        }
    }
});

app.controller("cont", function($scope) {
    $scope.total_money = 10000;
    $scope.categories = [
        {
            name: "food",
            background: "#888",
            height: '20px'
        },
        {
            name: "health",
            background: "#555",
            height: '20px'
        },
        {
            name: "entertainment",
            background: "#888",
            height: '20px'
        },
        {
            name: "savings",
            background: "#555",
            height: '20px'
        }
    ];

    $scope.$watch("categories", function() {
        calcCategories();
    }, true);

    $scope.$watch("total_money", function() {
        calcCategories();
    });

    var calcCategories = function() {
        var total = calcTotal();

        for (var i = 0; i < $scope.categories.length; i++) {
            var percents = $scope.categories[i].range_width / total;
            $scope.categories[i].percents = percents;
            $scope.categories[i].share = $scope.total_money * percents;
        }
    }

    var calcTotal = function() {
        var total = 0;
        for (var i = 0; i < $scope.categories.length; i++) {
            total += $scope.categories[i].range_width;
        }

        return total;
    }

    $scope.removeCategory = function(category) {
        var index = $scope.categories.indexOf(category);

        if (index != -1) {
            $scope.categories.splice(index, 1);
        }
    }

    $scope.addCategory = function() {
        $scope.categories.push({name: "new name", background: "#888"});
    }
});