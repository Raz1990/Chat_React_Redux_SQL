import {Action, applyMiddleware, createStore, Dispatch, Unsubscribe} from "redux";
import {AppState} from "./../Interfaces/appState";
import thunk from "redux-thunk";
import {rootReducer} from "./reducers";

const initialState: AppState = {
    allUsers: null,
    allGroups: null,
    allEntities: null,
    currentUser: null,
    inChatWith: null,
    chatElement: null
};

interface AppStore {
    dispatch: Dispatch<Action | any>;
    getState(): AppState;
    subscribe(listener: () => void): Unsubscribe;
}

export const store: AppStore = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk),
);
