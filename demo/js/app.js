(function() {

    'use strict';

    /**
     * Test code for ng-monthpicker demo
     */
    angular
        .module('testApp', ['ngFlatMonthpicker'])
        .controller('mainController', ['$scope', mainController]);

    function mainController ($scope) {

        $scope.monthPickerConfig = {
            allowFuture: false,
            dateFormat: 'DD/MM/YYYY'
        };
    }

})();
