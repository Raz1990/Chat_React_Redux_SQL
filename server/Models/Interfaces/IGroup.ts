import IChatEntity from "./ChatEntity";

export default interface IGroup {
    id: string,
    group_name: string,
    members: IChatEntity[],
    is_child?: boolean,
    parent?: IGroup
}