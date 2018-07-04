"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Controllers = require("../Controllers");
var groupsRouter = express.Router();
groupsRouter.get('/', Controllers.GroupsController.getAllGroups);
groupsRouter.post('/addGroup', Controllers.GroupsController.addGroup);
groupsRouter.delete('/deleteGroup', Controllers.GroupsController.deleteGroup);
groupsRouter.post('/moveGroups', Controllers.GroupsController.moveGroups);
groupsRouter.post('/updateGroup', Controllers.GroupsController.updateGroup);
groupsRouter.post('/addUserToGroup', Controllers.GroupsController.addUserToGroup);
groupsRouter.post('/removeUserFromGroup', Controllers.GroupsController.removeUserFromGroup);
exports.default = groupsRouter;
//# sourceMappingURL=GroupsRouter.js.map