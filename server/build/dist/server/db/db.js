"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db = require("mysql");
//const db = require('mysql');
var conn, query;
var DB = /** @class */ (function () {
    function DB() {
    }
    DB.prototype.initConnection = function () {
        conn = db.createConnection({
            host: 'localhost',
            user: 'root',
            password: '111111',
            database: 'chat'
        });
        conn.connect();
    };
    DB.prototype.getConnection = function () {
        if (!conn) {
            this.initConnection();
        }
        return conn;
    };
    DB.select = function (what, table) {
        var filters = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            filters[_i - 2] = arguments[_i];
        }
        query = "SELECT " + what + " FROM " + table;
        if (filters.length > 0) {
            query += ' WHERE';
        }
        var filtersCount = 0;
        for (var _a = 0, filters_1 = filters; _a < filters_1.length; _a++) {
            var filter = filters_1[_a];
            if (isNaN(filter.value)) {
                query += " " + filter.field + " = '" + filter.value + "'";
            }
            else {
                query += " " + filter.field + " = " + filter.value;
            }
            if (++filtersCount < filters.length) {
                query += ' AND ';
            }
        }
        return query;
    };
    DB.insert = function (table) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        query = "INSERT INTO " + table + " VALUES (0,";
        var valuesCount = 0;
        for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
            var value = values_1[_a];
            if (isNaN(value)) {
                query += "'" + value + "'";
            }
            else {
                query += value;
            }
            if (++valuesCount < values.length) {
                query += ', ';
            }
        }
        query += ')';
        return query;
    };
    DB.update = function (table, filter) {
        var values = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            values[_i - 2] = arguments[_i];
        }
        // assures theres no updating a whole table by mistake
        if (!filter) {
            return '';
        }
        query = "UPDATE " + table + " SET ";
        var valuesCount = 0;
        for (var _a = 0, values_2 = values; _a < values_2.length; _a++) {
            var value = values_2[_a];
            if (isNaN(value.value)) {
                query += value.field + " = '" + value.value + "'";
            }
            else {
                query += value.field + " = " + value.value;
            }
            //query+= value.field + ' = ' + value.value;
            if (++valuesCount < values.length) {
                query += ', ';
            }
        }
        if (filter) {
            query += " WHERE " + filter.field + " = " + filter.value;
        }
        return query;
    };
    DB.delete = function (table) {
        var filters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            filters[_i - 1] = arguments[_i];
        }
        query = "DELETE FROM " + table + " WHERE ";
        var filtersCount = 0;
        for (var _a = 0, filters_2 = filters; _a < filters_2.length; _a++) {
            var filter = filters_2[_a];
            if (isNaN(filter.value)) {
                query += " " + filter.field + " = '" + filter.value + "'";
            }
            else {
                query += " " + filter.field + " = " + filter.value;
            }
            if (++filtersCount < filters.length) {
                query += ' AND ';
            }
        }
        return query;
    };
    return DB;
}());
exports.default = DB;
//# sourceMappingURL=db.js.map