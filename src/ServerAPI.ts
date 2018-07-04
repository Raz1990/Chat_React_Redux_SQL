export class ServerAPI {
    static baseUrl = 'http://localhost:4000';

    static async getUsers() {
        return this.get('/users');
    }

    static async getGroups() {
        return this.get('/groups');
    }

    static getSingleUser(name: string, pass?: string) {
        const user = {
            name: name,
            pass: pass
        };
        return this.post('/users/login', user);
    }

    static getMessages(senderName: string, receiverName: string, receiverType: string) {
        const chat = {
            senderName: senderName,
            receiverName: receiverName,
            receiverType: receiverType
        };
        return this.post('/messages/getHistory', chat);
    }

    static addMessageToAConversation(senderName: string, receiverName: string, type: string, message: string, time: string) {
        const msg = {
            senderName: senderName,
            receiverName: receiverName,
            type: type,
            message: message,
            time: time
        };
        return this.post('/messages/addMessage', msg);
    }

    static createUser(user) {
        return this.post('/users/addUser', user);
    }

    static createGroup(group) {
        return this.post('/groups/addGroup', group);
    }

    static deleteUser(user) {
        return this.delete('/users/deleteUser', user);
    }

    static deleteGroup(group) {
        return this.delete('/groups/deleteGroup', group);
    }

    static updateUser(user) {
        return this.put('/users/updateUser', user);
    }

    static updateGroup(group) {
        return this.post('/groups/updateGroup', group);
    }

    static addGroupToGroup(host, mover) {
        const groups = {
            host,
            mover
        };
        return this.post('/groups/moveGroups', groups);
    }

    static addUserToGroup(groupName, userName) {
        const addingObject = {
            groupName,
            userName
        };
        return this.post('/groups/addUserToGroup', addingObject);
    }

    static removeUserFromGroup(groupName, userName) {
        const removingObject = {
            groupName,
            userName
        };
        return this.post('/groups/removeUserFromGroup', removingObject);
    }

    static get(url) {
        return fetch(this.baseUrl + url)
            .then(res => res.json());
    }

    static post(url, body) {
        return fetch(this.baseUrl + url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json());
    }

    static put(url, body) {
        return fetch(this.baseUrl + url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json());
    }

    static delete(url, body) {
        return fetch(this.baseUrl + url, {
            method: 'DELETE',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json());
    }
}

