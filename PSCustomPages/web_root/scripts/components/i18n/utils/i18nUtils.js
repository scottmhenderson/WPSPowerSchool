define(function(require) {
    'use strict';

    var sharedModule = require('components/i18n/module');
    var serviceId = 'i18nUtils';

    sharedModule.factory(serviceId, [
        '$locale',
        '$filter',
        function ($locale, $filter) {

            var i18nUtils = {
                getShortFormat: function(){
                    return $locale.DATETIME_FORMATS.shortDate;
                },
                getDateFormat: function(){
                    return $locale.DATETIME_FORMATS.mediumDate;
                },
                getDateText: function(){
                    return $locale.DATETIME_FORMATS.mediumDateText;
                },
                getText: function(messageKey, params){
                    var paramsMap = {};
                    var i;
                    if(params){
                        for(i=0; i<params.length; i++){
                            paramsMap['arg'+i] = params[i];
                        }
                    }
                    return $filter('translate')(messageKey,paramsMap);
                },
                //TODO this is written for English Only. It needs to be internationalized.
                getLocalizedDate: function(d, fmt) {
                    if (fmt === 'mmdd') {
                        return ('' + (d.getMonth() + 1) + '/' + d.getDate() + '');
                    }
                    return ('' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + '');
                },
                getNumericFormat: function(){
                    //{ format: "#,##0.#########", size: "3", gs: ",", ds: ".", regex: "([-]?(([0-9]{1,3}(,[0-9]{3})*(\.[0-9]+)?|\.[0-9]+)|([0-9]*(\.[0-9]+)?)))" }
                    return {
                        format:$locale.NUMBER_FORMATS.number_format,
                        size:$locale.NUMBER_FORMATS.PATTERNS[0].gSize,
                        gs: $locale.NUMBER_FORMATS.GROUP_SEP,
                        ds: $locale.NUMBER_FORMATS.DECIMAL_SEP,
                        regex: $locale.NUMBER_FORMATS.number_regex
                    };
                },
                localizeNumber: function(number){
                    return i18nUtils.formatNumber(i18nUtils.getNumericFormat(),number);
                },
                deLocalizeNumber: function(number){
                    return i18nUtils.removeNumberFormat(i18nUtils.getNumericFormat(), number);
                },
                formatNumber: function(format, number){
                    var ds = format.ds; // decimal separator
                    var result = '';

                    if (isNaN(number)){
                        return number;
                    } else {
                        result = number.toString();
                        result = result.replace('.',ds);
                        return result;
                    }
                },
                removeNumberFormat: function(format, number) {
                    // IE does not like instantiating RegExp objects with empty values, so we have to
                    // check for valid values in the grouping separator before using it in a RegExp.
                    var gsNotBlank = (format.gs === '.' || format.gs === ',' || format.gs === ' ');
                    number = number.toString();
                    // We also want to check that only valid characters are present.
                    var regexString = '^' + format.regex + '$';
                    var validNumber = new RegExp(regexString, 'g');
                    if (number !== '' && number.match(validNumber) != null) {
                        if (gsNotBlank) {
                            var gs = new RegExp('\\'+format.gs, 'g');
                            number = number.replace(gs, '');
                        }
                        var ds = new RegExp('\\'+format.ds, 'g'); //The decimal separator is not expected to be empty
                        number = parseFloat(number.replace(ds, '.'));
                    } else {
                        return null;
                    }
                    return (isNaN(number)) ? null : number;
                }
            };

            return i18nUtils;
        }
    ]);
});