import ICanChat from "./ChatEntity";

export default interface IGroup {
    id?: number,
    group_name: string,
    parent: string | null,
    is_child?: boolean,
    members?: ICanChat[]
}