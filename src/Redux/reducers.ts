import {AnyAction} from "redux";
import {AppState} from "./../Interfaces/appState";
import {User} from "../Classess/User";
import {Group} from "../Classess/Group";
import ICanChat from "../Interfaces/ChatEntity";

const handlers = {
    "SET_CURRENT_USER": setCurrentUser,
    "SET_ALL_USERS": setAllUsers,
    "SET_ALL_GROUPS": setAllGroups,
    "SET_ALL_ENTITIES": setAllEntities,
    "SET_IN_CHAT_WITH":setInChatWith,
    "SET_CHAT_ELEMENT":setChatElement,
    "REFRESH": refresh,
};

export function rootReducer(state: AppState, action: AnyAction): AppState {
    const handler = handlers[action.type];
    if(handler) {
        return handler(state, action.value);
    }

    return state;
}

function refresh(state: AppState) {
    return {
        ...state,
    }
}

function setCurrentUser(state: AppState, user: User): AppState {
    return {
        ...state,
        currentUser: user,
    }
}

function setAllUsers(state: AppState, users: User[]): AppState {
    return {
        ...state,
        allUsers: users,
    }
}

function setAllGroups(state: AppState, groups: Group[]): AppState {
    return {
        ...state,
        allGroups: groups,
    }
}

function setAllEntities(state: AppState, entities: ICanChat[]): AppState {
    return {
        ...state,
        allEntities: entities,
    }
}

function setInChatWith(state: AppState, chatElement: ICanChat): AppState {
    return {
        ...state,
        inChatWith: chatElement,
    }
}

function setChatElement(state: AppState, element: HTMLElement): AppState {
    return {
        ...state,
        chatElement: element,
    }
}




