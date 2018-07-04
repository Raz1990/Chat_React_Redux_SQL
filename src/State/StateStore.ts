import {ServerAPI} from "./../ServerAPI";

interface IStateSore {
    state: {};
    set(key:string, val: string): any
    get(key:string): void;
}

class StateStore implements IStateSore{

    listeners: Function[];

    constructor(){
        this.listeners = [];

        ServerAPI.getUsers()
            .then((users) => {
                this.state["allUsers"] = users;

                ServerAPI.getGroups()
                    .then((groups) => {
                        this.state["allGroups"] = groups;
                        this.state["allEntities"] = this.createEntities();
                    });
            });
    }

    createEntities() {
        let entityArray = [];

        entityArray = entityArray.concat(this.state["allGroups"]).concat(this.state["allUsers"]);

        return entityArray;
    }

    state: {} = {
        allUsers: null,
        allGroups: null,
        allEntities: null,
        currentUser: null,
        inChatWith: null,
        chatElement: null
    };

    subscribe(listener: any){
        return this.listeners.push(listener);
    }

    unsubscribe(index: number){
        this.listeners.splice(index,1);
    }

    set(key:string, val:any){
        this.state[key] = val;
        this.onStoreChanged();
    }

    get(key:string){
        return this.state[key] || null;
    }

    onStoreChanged(){
        for(const listener of this.listeners){
            listener();
        }
    }

    static instance: StateStore;

    static getInstance(){
        if (!StateStore.instance){
            StateStore.instance = new StateStore();
        }

        return StateStore.instance;
    }
}

export default StateStore;