import Db2 from "../../db/db2";

const db = Db2.getInstance();

export function getMessagesHistory(chat) {
    return new Promise((resolve, reject) => {
        const result = _getMessagesHistory(chat);
        resolve(result);
    });
}

function _getMessagesHistory(chat) {
    return db.getMessageHistory(chat.senderName, chat.receiverName, chat.receiverType);
}

export function addMessage(msg) {
    return new Promise((resolve, reject) => {
        const result = _addMessage(msg);
        resolve(result);
    });
}

function _addMessage(msg) {
    return db.addMessageToAConversation(msg.senderName, msg.receiverName, msg.type, msg.message, msg.time);
}
