function refresh(){
    return {
        type: "REFRESH",
        value: null,
    }
}

function setCurrentUser(user){
    return {
        type: "SET_CURRENT_USER",
        value: user,
    }
}

function setAllUsers(users){
    return {
        type: "SET_ALL_USERS",
        value: users,
    }
}

function setAllGroups(groups){
    return {
        type: "SET_ALL_GROUPS",
        value: groups,
    }
}

function setChatEntities(entities){
    return {
        type: "SET_ALL_ENTITIES",
        value: entities,
    }
}

function setInChatWith(entity){
    return {
        type: "SET_IN_CHAT_WITH",
        value: entity,
    }
}

function setChatElement(element){
    return {
        type: "SET_CHAT_ELEMENT",
        value: element,
    }
}

export {refresh,setCurrentUser,setAllUsers,setAllGroups,setChatEntities,setInChatWith,setChatElement};