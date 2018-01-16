ng-flat-monthpicker
===

Lightweight Angular.js monthpicker directive based on the work of [RemiAWE/ng-flat-datepicker](https://github.com/RemiAWE/ng-flat-datepicker)

![ng-flat-monthpicker screenshot](https://imgur.com/a/dgp1I)

## Run Demo Locally
1. Run the following commands inside the project directory

* ```npm install```

* ```gulp compile```

2. Open demo/index.html in the browser

## Features
* Month-only Picker from a range of years
* Multiple and Ranged selection of months in one dialog

## Requirements
* Angularjs >=1.2
* Moment.js

## Options

### Attributes:
* `picker-config`: **Object** - The monthpicker's config object.
* `picker-id` : **String** - Important if it is required to start scrolling from current year in the list when there are multiple pickers inside the same parent
 

```html
<input type="text" ng-model="months_1" ng-flat-monthpicker picker-config="pickerConfig" picker-id="1">
```

### Config object properties:

* `monthFormat`: **String** - The Moment.js format of the month in the `ng-model`. Default format is`'MMM YYYY'`.
* `startYear`: **int** - Start year of the list. Default value is `2000`.
* `futureYear`: **int** - End year of the list is calculated with this value. e.g. endYear = currentYear + futureYear. Default value is `0`.
* `isRanged`: **Boolean** - if true then range selection will be set from the start. Also can be changed in runtime.
