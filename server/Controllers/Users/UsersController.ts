import * as services from './../../Services';

export async function getUserById(req , res) {
    try {
        const user = await services.UsersService.getUserById(req.params.id);
        res.json(user);
    }
    catch (e) {
        res.send('Bad request');
    }
}

export async function getUserByNameXORPassword(req , res) {
    try {
        const user = await services.UsersService.getUserByNameXORPassword(req.body);
        res.json(user);
    }
    catch (e) {
        res.send('Bad request');
    }
}

export async function getAllUsers(req , res) {
    try {
        const users = await services.UsersService.getAllUsers();
        res.json(users);
    }
    catch (e) {
        res.send('Bad request');
    }
}

export async function addUser(req , res) {
    try {
        const user = await services.UsersService.addUser(req.body);
        res.json(user);
    }
    catch (e) {
        res.send('Bad request');
    }
}

export async function deleteUser(req , res) {
    try {
        const user = await services.UsersService.deleteUser(req.body);
        res.json(user);
    }
    catch (e) {
        res.send('Bad request');
    }
}

export async function updateUser(req , res) {
    try {
        const user = await services.UsersService.updateUser(req.body);
        res.json(user);
    }
    catch (e) {
        res.send('Bad request');
    }
}




