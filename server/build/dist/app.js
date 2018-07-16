"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var routes = require("./Routers");
var cors = require("cors");
var app = express();
app.use(cors());
app.use(express.json());
app.get('/', function (req, res) {
    res.send('Hello');
});
app.use('/users', routes.usersRouter);
app.use('/groups', routes.groupsRouter);
app.use('/messages', routes.messagesRouter);
exports.default = app;
//# sourceMappingURL=app.js.map