'use strict';

var _ = require('lodash');

var _int = /^-?\d+$/gi,
    _flt = /^-?\d+(\.\d+)?$/gi,
    _hour = /^\d{1,2}:\d{1,2}:?\d*$/gi,
    _date = /^\d{2,4}-\d{2}-\d{2}$/gi,
    _datetime = /^\d{2,4}-\d{2}-\d{2}(?:\s|T)\d{1,2}:\d{1,2}:?\d*(?:\.\d+Z?|\s*\-?\+?\d+\:?\d*)?$/gi,
    _email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/gi;

var types = {
    integer: function (val) {
        _int.lastIndex = 0;

        return _int.test(val);
    },
    float: function (val) {
        _flt.lastIndex = 0;

        return _flt.test(val);
    },
    hour: function (val) {
        _hour.lastIndex = 0;

        return _hour.test(val);
    },
    date: function (val) {
        _date.lastIndex = 0;

        return _date.test(val);
    },
    datetime: function (val) {
        _datetime.lastIndex = 0;

        return _datetime.test(val);
    },
    email: function (val) {
        _email.lastIndex = 0;

        return _email.test(val);
    },
    string: function (val) {
        try {
            if(val.toString().length > 0) {
                return true;
            }

            return false;
        } catch (e) {
            return false;
        }
    },
    required: function (val) {
        return val
    },
    norequired: function (val) {
        return !val;
    }
};

var messages = {
    notExists: "not_exists",
    notMatch: "not_match",
    invalidString: "invalid_string",
    invalidNumber: "invalid_number",
    notFound: "not_found",
    invalidDate: "invalid_date",
    invalidNoRequired: "not_requested"
};

function check (info) {
    info = info || {};

    return {
        verify: function (_v) {
            var rsp = [];

            // Get the param name in the vector
            for (var k in _v) {
                if(_v[k] instanceof RegExp) {
                    _v[k].lastIndex = 0;

                    if(!_v[k].test(info[k])) {
                        rsp.push(k + messages.notMatch);
                    }
                } else if (typeof _v[k] == "string") {
                    if(types[_v[k]]) {
                        if(!types[_v[k]](info[k])) {
                            switch (_v[k]) {
                                case 'string':
                                    rsp.push(`E:${k}.${messages.invalidString}`);
                                    break;
                                case 'integer':
                                case 'float':
                                    rsp.push(`E:${k}.${messages.invalidNumber}`);
                                    break;
                                case 'datetime':
                                case 'date':
                                    rsp.push(`E:${k}.${messages.invalidDate}`);
                                    break;
                                case 'required':
                                    rsp.push(`E:${k}.${messages.notFound}`);
                                    break;
                                case 'norequired':
                                    rsp.push(`E:${k}.${messages.invalidNoRequired}`);
                                    break;
                                default:
                                    rsp.push(`E:${k}.${messages.notMatch}`);
                            }
                        }
                    } else {
                        rsp.push(k + messages.notFound);
                    }
                }
            }

            return rsp;
        }
    };
}

module.exports = check;
