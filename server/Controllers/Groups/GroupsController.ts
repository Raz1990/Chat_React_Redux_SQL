import * as services from './../../Services';

export async function getAllGroups(req , res) {
    try {
        const groups = await services.GroupsService.getAllGroups();
        res.json(groups);
    }
    catch (e) {
        console.log('GET ALL GROUPS ERROR',e);
        res.send('Bad request', e);
    }
}

export async function addGroup(req , res) {
    try {
        const group = await services.GroupsService.addGroup(req.body);
        res.json(group);
    }
    catch (e) {
        res.send('Bad request');
    }
}

export async function updateGroup(req , res) {
    try {
        const groups = await services.GroupsService.updateGroup(req.body);
        res.json(groups);
    }
    catch (e) {
        res.send('Bad request');
    }
}

export async function moveGroups(req , res) {
    try {
        const group = await services.GroupsService.moveGroups(req.body);
        res.json(group);
    }
    catch (e) {
        res.send('Bad request');
    }
}

export async function addUserToGroup(req , res) {
    try {
        const group = await services.GroupsService.addUserToGroup(req.body);
        res.json(group);
    }
    catch (e) {
        res.send('Bad request');
    }
}

export async function removeUserFromGroup(req , res) {
    try {
        const group = await services.GroupsService.removeUserFromGroup(req.body);
        res.json(group);
    }
    catch (e) {
        res.send('Bad request');
    }
}

export async function deleteGroup(req , res) {
    try {
        const group = await services.GroupsService.deleteGroup(req.body);
        res.json(group);
    }
    catch (e) {
        res.send('Bad request');
    }
}
