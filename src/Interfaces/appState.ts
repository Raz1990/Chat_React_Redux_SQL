import {User} from "./../Classess/User";
import {Group} from "./../Classess/Group";
import ICanChat from "./ChatEntity";

export interface AppState {
    allUsers: User[],
    allGroups: Group[],
    allEntities: ICanChat[],
    currentUser: User,
    inChatWith: ICanChat,
    chatElement: HTMLElement
}