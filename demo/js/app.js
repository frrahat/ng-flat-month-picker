(function() {

    'use strict';

    /**
     * Test code for ng-monthpicker demo
     */
    angular
        .module('testApp', ['ngFlatMonthpicker'])
        .controller('mainController', ['$scope', mainController]);

    function mainController ($scope) {

        $scope.pickerConfig = {
            monthFormat: 'MMM YYYY',
            startYear: 2010,
            futureYear: 20
        };
    }

})();
