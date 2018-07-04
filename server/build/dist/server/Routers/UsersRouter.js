"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Controllers = require("../Controllers");
var usersRouter = express.Router();
usersRouter.get('/', Controllers.UsersController.getAllUsers);
usersRouter.get('/:id', Controllers.UsersController.getUserById);
usersRouter.post('/login', Controllers.UsersController.getUserByNameXORPassword);
usersRouter.post('/addUser', Controllers.UsersController.addUser);
usersRouter.delete('/deleteUser', Controllers.UsersController.deleteUser);
usersRouter.put('/updateUser', Controllers.UsersController.updateUser);
/*usersRouter.get('/:name', (req, res) => {
    const name = req.params.name;
    res.send('user name: ', name);
});*/
exports.default = usersRouter;
//# sourceMappingURL=UsersRouter.js.map