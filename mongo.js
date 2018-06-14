/*
    Created by Pravin Lolage on 11 June 2018.
*/
let MongoClient = require('mongodb').MongoClient;
let libMongo = {};

let init = (dbConfig) => {
    return new Promise((resolve, reject) => {

        // set config here for later use
        libMongo.dbConfig = dbConfig

        if (!libMongo.dbConfig.init) {
            libMongo.conn = null;
            return resolve(null);
        }

        MongoClient.connect(libMongo.dbConfig.uri, function (err, client) {
            if (err) {
                console.error('libMongo.init, error connecting mongodb in init():', {uri: libMongo.dbConfig.uri});
                reject(err);
            }
            else {
                // console.log('libMongo.init, success connection to mongodb in init():', {uri: libMongo.dbConfig.uri});
                let dbHandler = client.db(libMongo.dbConfig.database);
                libMongo.conn = dbHandler;
                libMongo.client = client;

                resolve(null);
                client.on('error', function () {
                    console.error('libMongo.init, error connecting mongodb:', {uri: libMongo.dbConfig.uri});
                    libMongo.conn = null;
                    libMongo.client = null;
                });
                client.on('close', function () {
                    console.error('libMongo.init, connection closed:', {uri: libMongo.dbConfig.uri});
                });
                client.on('reconnect', function () {
                    // console.log('libMongo.init, re-connected to mongodb:', {uri: libMongo.dbConfig.uri});
                    libMongo.conn = dbHandler;
                    libMongo.client = client;
                });
            }
        });
    });
}

let find = (collectionName, findParams) => {
    return new Promise((resolve, reject) => {
        // console.log('libMongo.find, request', {db: 'mongo', collection: collectionName, params: findParams});
        if (libMongo.conn) {
            libMongo.conn.collection(collectionName).find(findParams).toArray(function (err, result) {
                if (err) {
                    console.error('libMongo.find, failed', {db: 'mongo', collection: collectionName, params: findParams});
                    reject(err);
                } else {
                    // console.log('libMongo.find, success', {db: 'mongo', collection: collectionName, params: findParams});
                    resolve(result);
                }
            });
        } else {
            console.error('libMongo.find, error connecting mongodb:', {uri: libMongo.dbConfig.uri});
            reject(new Error('Mongodb is not connected, please try again later'));
        }
    });
}

let findOne = (collectionName, findParams) => {
    return new Promise((resolve, reject) => {
        // console.log('libMongo.findOne, request', {db: 'mongo', collection: collectionName, params: findParams});
        if (libMongo.conn) {
            libMongo.conn.collection(collectionName).findOne(findParams, function (err, result) {
                if (err) {
                    console.error('libMongo.findOne, failed', {db: 'mongo', collection: collectionName, params: findParams});
                    reject(err);
                } else {
                    // console.log('libMongo.findOne, success', {db: 'mongo', collection: collectionName, params: findParams});
                    resolve(result);
                }
            });
        } else {
            console.error('libMongo.findOne, error connecting mongodb:', {uri: libMongo.dbConfig.uri});
            reject(new Error('Mongodb is not connected, please try again later'));
        }
    });
}

let update = (collectionName, findParams, updateParams) => {
    return new Promise((resolve, reject) => {
        // console.log('libMongo.update, request', {db: 'mongo', collection: collectionName, params: findParams});
        if (libMongo.conn) {
            libMongo.conn.collection(collectionName).update(findParams, {$set: updateParams}, function (err, result) {
                if (err) {
                    console.error('libMongo.update, failed', {db: 'mongo', collection: collectionName, params: findParams, updateParams: updateParams});
                    reject(err);
                } else {
                    // console.log('libMongo.update, success', {db: 'mongo', collection: collectionName, params: findParams, updateParams: updateParams});
                    resolve(result);
                }
            });
        } else {
            console.error('libMongo.update, error connecting mongodb:', {uri: libMongo.dbConfig.uri});
            reject(new Error('Mongodb is not connected, please try again later'));
        }
    });
}

let close = (__callback) => {
    if (libMongo.dbConfig.init) {
        console.error('libMongo.close, function called', {uri: libMongo.dbConfig.uri});
        libMongo.client.close();
        __callback(null);
    } else {
        __callback(null);
    }
}

module.exports = {
    __init: init,
    __find: find,
    __findOne: findOne,
    __update: update,
    __close: close
}
