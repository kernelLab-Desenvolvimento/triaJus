const express = require('express');

const db = require('../database/database.js');
const { broadcastToTable } = require('../websocket/websocket.js'); // ✅

const dbAcess = (req, res, next) => {
    req.db = db;
    req.broadcastToTable = broadcastToTable;
    next();
};

module.exports = { dbAcess };