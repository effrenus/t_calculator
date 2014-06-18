var $ = window.jQuery = require('./jquery/dist/jquery.js'),
    numeral = require('./numeral/numeral.js');

require('./rangeslider.js/dist/rangeslider.js');
require('./angular/angular.js');

require('./canvas.js');

numeral.language('_en', {
    delimiters: {
        thousands: ' ',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    ordinal : function (number) {
        return '';
    },
    currency: {
        symbol: '$'
    }
});
numeral.language('_en');

(function(){
    "use strict";

    function f1(){
        var r = 10*Math.random();
        return function(n) { return n*1.46*r; };
    }
    function f2(){
        var r = 10*Math.random();
        return function(n) { return n*1.25*12*r; };
    }

    var app = angular.module('calc', []);

    app.controller('accountCtrl', ['$scope', 'calc', function($scope, calc){
        var current;
        $scope.accountList = [
            {no: 12331, manager: 'Galaxy', formulas: [f1(), f2()]},
            {no: 32, manager: 'Veronica', formulas: [f1(), f2()]},
            {no: 3456, manager: 'Dragonfly', formulas: [f1(), f2()]},
            {no: 10001, manager: 'Condor', formulas: [f1(), f2()]},
            {no: 10050, manager: 'Shark_007', formulas: [f1(), f2()]}
        ];
        $scope.isActive = function(index) {
            return (current == index) ? 'account-active' : '';
        };
        $scope.chooseAccount = function(index){
            current = index;
            calc.setFormulas($scope.accountList[index].formulas);
        };
        $scope.chooseAccount(0);
    }]);

    app.controller('mainCtrl', ['$rootScope', 'calc', function($rootScope, calc){
        var $now = $('.calc').find('.deposit-now'),
            $year = $('.calc').find('.deposit-year');

        $rootScope.$on('calc.update', function(){
            var resultData = calc.calculate();
            $now.text(numeral(resultData[0]).format('0,0 $'));
            $year.text(numeral(resultData[1]).format('0,0 $'));
        });
    }]);

    app.factory('calc', ['$rootScope', function($rootScope){
        var _value = 0,
            _formulas = [];
        return {
            calculate: function(){
                var result = [];
                _formulas.forEach(function(func){
                    result.push(func(_value));
                });
                return result;
            },
            setValue: function(value){
                if(_value == value) return;

                _value = value;
                $rootScope.$emit('calc.update');
            },
            getValue: function(){
                return _value;
            },
            setFormulas: function(formulaList){
                _formulas = formulaList;
                $rootScope.$emit('calc.update');
            }
        };
    }]);

    app.directive('slider', ['calc', function(calc){
        function link(scope, element, attrs){
            var $slider, sliderWidth, elmValue = $('<div class="rangeslider__value"/>');

            $(element[0]).rangeslider({
                polyfill: false,
                onInit: function(){
                    $slider = $(element[0]).parent().find('.rangeslider');
                    $slider.append(elmValue);
                    sliderWidth = $slider.width();
                },
                onSlide: function(left, value){
                    elmValue.css('left', left).text(numeral(value).format('0,0 $'));
                    calc.setValue(value);
                    $slider[(sliderWidth - left <= 20)?'addClass':'removeClass']('pre-end');
                }
            });
        }

        return {
            restrict: 'A',
            link: link
        };
    }]);

    app.directive('accountSwitcher', function(){
        return {
            restrict: 'E',
            replace: true,
            controller: 'accountCtrl',
            templateUrl: 'js/templates/account-switcher.html'
        };
    })

})();