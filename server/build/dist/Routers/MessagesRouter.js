"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Controllers = require("../Controllers");
var messagesRouter = express.Router();
messagesRouter.post('/getHistory', Controllers.MessagesController.getMessagesHistory);
messagesRouter.post('/addMessage', Controllers.MessagesController.addMessage);
exports.default = messagesRouter;
//# sourceMappingURL=MessagesRouter.js.map