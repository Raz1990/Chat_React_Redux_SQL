export class ServerAPI {
    static baseUrl = 'http://localhost:4000';

    static async getUsers() {
        return this.get('/users');
    }

    static async getGroups() {
        return this.get('/groups');
    }

    static async getGroupMembers(id) {
        return this.get('/groups/'+id);
    }

    static async getAllUsersInGroups() {
        return this.get('/users/usersInGroups');
    }

    static getSingleUser(user_name: string, password?: string) {
        const user = {
            user_name,
            password
        };
        return this.post('/users/login', user);
    }

    static getMessages(sender_id: number, receiver_id: number, type: string) {
        const chat = {
            sender_id,
            receiver_id,
            type
        };
        return this.post('/messages/getHistory', chat);
    }

    static addMessageToAConversation(sender_id: number, receiver_id: number, type: string, content: string, time: string) {
        const msg = {
            sender_id,
            receiver_id,
            type,
            content,
            time
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
        return this.put('/groups/updateGroup', group);
    }

    static addGroupToGroup(host, mover) {
        const groups = {
            host,
            mover
        };
        return this.post('/groups/moveGroups', groups);
    }

    static addUserToGroup(host, user) {
        const addingObject = {
            host,
            user
        };
        return this.post('/groups/addUserToGroup', addingObject);
    }

    static removeUserFromGroup(group_id, user_id) {
        const removingObject = {
            group_id,
            user_id
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

