import * as db from 'mysql';
//const db = require('mysql');

let conn, query;

export default class DB {
    initConnection() {
        conn = db.createConnection({
            host: 'localhost',
            user: 'root',
            password: '111111',
            database: 'chat'
        });

        conn.connect();
    }

    getConnection(){
        if(!conn){
            this.initConnection();
        }

        return conn;
    }

    static select(what,table,...filters) {
        query = `SELECT ${what} FROM ${table}`;
        if (filters.length > 0){
            query += ' WHERE ';
        }
        let filtersCount = 0;
        for (const filter of filters){
            if (isNaN(filter.value)) {
                query += `${filter.field} = '${filter.value}'`;
            }
            else {
                query += `${filter.field} = ${filter.value}`;
            }
            if (++filtersCount < filters.length) {
                query += ' AND ';
            }
        }
        return query;
    }

    static insert(table,...values){
        query = `INSERT INTO ${table} VALUES (0,`;
        let valuesCount = 0;
        for (const value of values){
            if (isNaN(value)) {
                query += `'${value}'`;
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
    }

    static update(table, filter, ...values){
        // assures theres no updating a whole table by mistake
        if (!filter){
            return '';
        }
        query = `UPDATE ${table} SET `;
        let valuesCount = 0;
        for (const value of values){
            if (isNaN(value.value)) {
                query += `${value.field} = '${value.value}'`;
            }
            else {
                query += `${value.field} = ${value.value}`;
            }
            //query+= value.field + ' = ' + value.value;

            if (++valuesCount < values.length) {
                query += ', ';
            }
        }
        if (filter){
            query += ` WHERE ${filter.field} = ${filter.value}`;
        }
        return query;
    }

    static delete(table,...filters){
        query = `DELETE FROM ${table} WHERE `;
        let filtersCount = 0;
        for (const filter of filters){
            if (isNaN(filter.value)) {
                query += ` ${filter.field} = '${filter.value}'`;
            }
            else {
                query += ` ${filter.field} = ${filter.value}`;
            }
            if (++filtersCount < filters.length) {
                query += ' AND ';
            }
        }
        return query;
    }

    static CallSP(spName, ...params){
        query = `CALL ${spName} (`;
        let paramsCount = 0;
        for (const parameter of params){
            if (isNaN(parameter)) {
                query += `'${parameter}'`;
            }
            else {
                query += parameter;
            }
            if (++paramsCount < params.length) {
                query += ', ';
            }
        }
        query += ')';
    }
}