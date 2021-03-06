(function () {

    'use strict';

    /**
     * @desc Monthpicker directive
     * @example <ng-flat-monthpicker></ng-flat-monthpicker>
     */

    angular
        .module('ngFlatMonthpicker', [])
        .directive('ngFlatMonthpicker', ngFlatMonthpickerDirective);

    function ngFlatMonthpickerDirective($templateCache, $compile, $document, $timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                pickerConfig: '=?pickerConfig',
                pickerId: '=?pickerId'
            },
            link: function (scope, element, attrs, ngModel) {

                var template = angular.element($templateCache.get('monthpicker.html'));

                // Default options
                var defaultConfig = {
                    monthFormat: "MMM YYYY",
                    isRanged: true,
                    startYear: 2000,
                    futureYear: 0
                };

                // Apply and init options
                scope.pickerConfig = angular.extend(defaultConfig, scope.pickerConfig);
                if (angular.isUndefined(scope.pickerId)) scope.pickerId = '';

                var endYear = moment().year() + scope.pickerConfig.futureYear;

                //years list
                scope.yearsList = [];
                for (var year = scope.pickerConfig.startYear; year <= endYear; year++) {
                    scope.yearsList.push(year);
                }

                //months list
                var sm = moment.monthsShort();
                var shortMonths = [];
                for (var i = 0; i < sm.length; i++) {
                    shortMonths.push({
                        'name': sm[i],
                        'short': i < 9 ? '0' + String(i + 1) : String(i + 1)
                    });
                }
                scope.monthSlice1 = shortMonths.slice(0, 6)
                scope.monthSlice2 = shortMonths.slice(6, 12)

                var selectedMonths = [];

                scope.isRanged = scope.pickerConfig.isRanged;
                var dragStart = null;
                var dragEnd = null;
                var monthInFocus = null;

                var isScrollToCurrentYear = true;

                scope.isSelectionEmpty = true;

                scope.selectMonth = function (month, $event) {
                    scope.isSelectionEmpty = false;
                    if (scope.isRanged) {
                        _onDragOnOff(month);
                        return;
                    }
                    var index = selectedMonths.indexOf(month);
                    if (index >= 0) {
                        selectedMonths.splice(index, 1);
                    } else {
                        selectedMonths.push(month);
                    }
                    $event.stopPropagation();
                };

                function _isSelected(month) {
                    var index = selectedMonths.indexOf(month);
                    if (index >= 0) {
                        return true;
                    } else {
                        return false;
                    }
                }

                function _isOnDragLine(month) {
                    var diff_1 = dragStart - monthInFocus;
                    var diff_2 = dragStart - month;
                    if (diff_1 >= 0) {
                        if (diff_2 > 0 && diff_2 < diff_1) {
                            return true;
                        }
                    } else {
                        if (diff_2 < 0 && diff_2 > diff_1) {
                            return true;
                        }
                    }
                    return false;
                }

                scope.getStyle = function (month) {
                    if (scope.isRanged && dragStart != null) {
                        if (_isOnDragLine(month)) {
                            return ({
                                'background-color': '#e6e6e6',
                                'color': '#393939',
                                'border-radius': '0px'
                            });
                        } 
                        
                        var styleToFaceRight = {
                            'background-color': '#569ff7',
                            'color': '#fff',
                            'border-top-left-radius' : '0px',
                            'border-bottom-left-radius' : '0px'
                        } 

                        var styleToFaceLeft = {
                            'background-color': '#569ff7',
                            'color': '#fff',
                            'border-top-right-radius' : '0px',
                            'border-bottom-right-radius' : '0px'
                        }

                        if (month == dragStart) {
                            if(dragStart - monthInFocus > 0) {
                                return styleToFaceRight;
                            } else {
                                return styleToFaceLeft;
                            }
                        } 
                        if (month == monthInFocus) {
                            if(dragStart - monthInFocus > 0) {
                                return styleToFaceLeft;
                            } else {
                                return styleToFaceRight;
                            }
                        }
                    }
                    if (_isSelected(month)) {
                        var style = {
                            'background-color': '#b3f1a8',
                            'color': 'black'
                        };

                        var nextMonth = +month + 1;
                        if(nextMonth % 100 == 13) nextMonth += 88;

                        var prevMonth = +month - 1;
                        if(prevMonth % 100 == 0) prevMonth -= 88;

                        if(_isSelected(String(prevMonth))) {
                            style = angular.extend(style, {
                                'border-top-left-radius' : '0px',
                                'border-bottom-left-radius' : '0px'
                            });
                        }

                        if(_isSelected(String(nextMonth))) {
                            style = angular.extend(style, {
                                'border-top-right-radius' : '0px',
                                'border-bottom-right-radius' : '0px'
                            });
                        }

                        return style;
                    } else {
                        return {}
                    }
                }

                scope.close_picker = function () {
                    _onDone();
                }

                scope.clear_picker = function () {
                    selectedMonths.length = 0;
                    scope.isSelectionEmpty = true;
                }

                function _onDragOnOff(month) {
                    if (dragStart == null) {
                        dragStart = month;
                    } else {
                        dragEnd = month;
                        var startMonth, endMonth;
                        if (dragStart <= dragEnd) {
                            startMonth = parseInt(dragStart);
                            endMonth = parseInt(dragEnd);
                        } else {
                            startMonth = parseInt(dragEnd);
                            endMonth = parseInt(dragStart);
                        }

                        var nextMonth = startMonth;

                        while (nextMonth <= endMonth) {
                            selectedMonths.push(String(nextMonth));
                            nextMonth += 1;
                            if (nextMonth % 100 == 13) {
                                nextMonth += 88;
                            }
                        }
                        dragStart = dragEnd = null;
                    }
                }

                scope.onMouseEnter = function (month) {
                    monthInFocus = month;
                }

                // Display
                scope.pickerDisplayed = false;

                element.bind('click', function () {
                    scope.$apply(function () {
                        scope.pickerDisplayed = true;
                        $document.on('click', onDocumentClick);
                    });

                    if (isScrollToCurrentYear) {
                        $timeout(function() {
                            var id = scope.pickerId + '_tbl_' + moment().year();
                            $document[0].getElementById(id).scrollIntoView();
                        }, 0);
                        isScrollToCurrentYear = false;
                    }   
                });

                function onDocumentClick(e) {
                    if (template !== e.target && !template[0].contains(e.target) && e.target !== element[0]) {
                        $document.off('click', onDocumentClick);
                        scope.$apply(function () {
                            scope.pickerDisplayed = false;
                        });
                    }
                }

                function _onDone() {
                    $document.off('click', onDocumentClick);
                    scope.pickerDisplayed = false;

                    selectedMonths.sort();
                    var formattedResult = [];
                    var prevMonth = '';
                    for (var i = 0; i < selectedMonths.length; i++) {
                        var curMonth = selectedMonths[i];
                        if (prevMonth == curMonth) {
                            continue;
                        }
                        prevMonth = curMonth;

                        var forMattedMonth = moment(curMonth, 'YYYYMM').format(scope.pickerConfig.monthFormat);
                        formattedResult.push(forMattedMonth);
                    }
                    ngModel.$setViewValue(formattedResult);
                    ngModel.$render();
                }

                init();

                /**
                 * Init the directive
                 * @return {}
                 */
                function init() {

                    element.wrap('<div class="ng-flat-monthpicker-wrapper"></div>');

                    $compile(template)(scope);
                    element.after(template);
                }
            }
        };
    }

})();