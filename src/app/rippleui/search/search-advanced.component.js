/*
   ~  Copyright 2016 Ripple Foundation C.I.C. Ltd
   ~  
   ~  Licensed under the Apache License, Version 2.0 (the "License");
   ~  you may not use this file except in compliance with the License.
   ~  You may obtain a copy of the License at
   ~  
   ~    http://www.apache.org/licenses/LICENSE-2.0
 
   ~  Unless required by applicable law or agreed to in writing, software
   ~  distributed under the License is distributed on an "AS IS" BASIS,
   ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   ~  See the License for the specific language governing permissions and
   ~  limitations under the License.
 */
let templateSearch = require('./search-advanced.html');

class SearchAdvancedController {
  constructor($scope, $http, $ngRedux, serviceRequests, searchActions, $state) {
    // serviceRequests.publisher('routeState', {state: $state.router.globals.current.views, name: 'main-search'});
    // serviceRequests.publisher('headerTitle', {title: 'Welcome', isShowTitle: true});

    this.cancel = function () {
      serviceRequests.publisher('toggleAdvancedSearch', {});
    };

    var changeState = function () {
      $scope.formSubmitted = true;

      if ($scope.patients.constructor === Array && $scope.patients.length == 1) {
        $state.go('patients-summary', {
          patientId: $scope.patients[0].nhsNumber
        });
      } else if ($scope.patients.constructor === Array && $scope.patients.length > 1) {
        $state.go('patients-list', {
          patientsList: $scope.patients,
          advancedSearchParams: $scope.searchParams
        });
      } else {
        $state.go('patients-list', {
          patientsList: $scope.patients,
          advancedSearchParams: $scope.searchParams,
          displayEmptyTable: true
        });
      }
    };

    $scope.formSubmitted = false;
    $scope.detailsFocused = false;
    $scope.searchParams = {};

    if ($scope.searchParams.surname) {
      $scope.surnameFocus = true;
    }
    else {
      $scope.nhsNumberFocus = true;
    }

    if ($scope.searchParams.dateOfBirth) {
      $scope.searchParams.dateOfBirth = new Date($scope.searchParams.dateOfBirth).toISOString().slice(0, 10);
      $scope.detailsFocused = true;
    }

    $scope.getResult = function (result) {
      $scope.patients = result.data;

      if ($scope.patients) {
        changeState();
      }
    };

    $scope.ok = function (searchForm) {
      /* istanbul ignore if */
      if ($scope.searchParams.nhsNumber) {
        $scope.searchParams.nhsNumber = $scope.searchParams.nhsNumber.replace(/\s+/g, '');
      }

      if (searchForm.$valid) {
        $scope.searchByDetails($scope.searchParams);

        let unsubscribe = $ngRedux.connect(state => ({
          setResult: $scope.getResult(state.search)
        }))(this);

        $scope.$on('$destroy', unsubscribe);
      }
    };

    $scope.openDatePicker = function ($event, name) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[name] = true;
    };

    $scope.isNhsNumberRequired = function (advancedSearchForm) {
      var nhsNumber = $scope.advancedSearchForm.nhsNumber.$viewValue;
      var areDetailsFieldsClean = $scope.areDetailsFieldsClean(advancedSearchForm);

      if (nhsNumber === undefined && areDetailsFieldsClean) {
        return true;
      }

      nhsNumber = nhsNumber.replace(/\s+/g, '');

      var nhsNumberInvalid = isNaN(nhsNumber) || (advancedSearchForm.nhsNumber.$invalid && nhsNumber.length === 0);

      return nhsNumberInvalid && areDetailsFieldsClean;
    };

    $scope.isNhsNumberTooShort = function (value) {
      if (value === undefined) {
        return false;
      }

      var nhsNumber = value.replace(/\s+/g, '');

      return !isNaN(nhsNumber) && nhsNumber.length > 0 && nhsNumber.length < 10;
    };

    $scope.isNhsNumberTooLong = function (value) {
      if (value === undefined) {
        return false;
      }

      var nhsNumber = value.replace(/\s+/g, '');

      return !isNaN(nhsNumber) && nhsNumber.length > 10;
    };

    $scope.isNhsNumberFieldInvalid = function (nhsNumberField) {
      return nhsNumberField.$invalid || nhsNumberField.$pristine;
    };

    $scope.areDetailsFieldsClean = function (advancedSearchForm) {
      var surname = advancedSearchForm.surname;
      var forename = advancedSearchForm.forename;
      var dateOfBirth = advancedSearchForm.dateOfBirth;

      var surnameClean = surname.$invalid || !$scope.searchParams.surname || $scope.searchParams.surname === '';
      var forenameClean = forename.$invalid || !$scope.searchParams.forename || $scope.searchParams.forename === '';
      var dateOfBirthClean = dateOfBirth.$invalid || !$scope.searchParams.dateOfBirth || $scope.searchParams.dateOfBirth === '';

      return surnameClean && forenameClean && dateOfBirthClean;
    };

    $scope.searchByDetails = function (queryParams) {
      /* istanbul ignore if */
      if (queryParams.dateOfBirth) {
        queryParams.dateOfBirth = new Date(queryParams.dateOfBirth.getTime() - (60000 * queryParams.dateOfBirth.getTimezoneOffset()));
      }
      this.searchResult = searchActions.advancedSearch;
      console.log('queryParams');
      console.log(queryParams);
      this.searchResult(queryParams);
    };
  }
}

const SearchAdvancedComponent = {
  template: templateSearch,
  controller: SearchAdvancedController
};

SearchAdvancedController.$inject = ['$scope', '$http', '$ngRedux', 'serviceRequests', 'searchActions', '$state'];
export default SearchAdvancedComponent;