import * as services from './../../Services';

export async function getMessagesHistory(req , res) {
    try {
        const messages = await services.MessagesService.getMessagesHistory(req.body);
        res.json(messages);
    }
    catch (e) {
        console.log('ERROR IN GETTING MESSAGE HISTORY ', e);
        res.send('Bad request');
    }
}

export async function addMessage(req , res) {
    try {
        const added = await services.MessagesService.addMessage(req.body);
        if (added) {
            res.json(added);
        }
    }
    catch (e) {
        res.send('Bad request');
    }
}

