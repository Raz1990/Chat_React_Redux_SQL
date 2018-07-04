import IChatEntity from '../Interfaces/ChatEntity';
export {User}

class User implements IChatEntity{

    constructor(private id, private user_name: string, private password: string, private age: number) {

    }

    getId() {
        return this.id;
    }

    getItems() {
        return [];
    }

    getType(): string {
        return "user";
    }

    getName() {
        return this.user_name;
    }

    setName(newName: string) {
        if (newName.length > 1) {
            this.user_name = newName;
        }
    }

    getPassword() {
        return this.password;
    }

    setPassword(newPass: string) {
        this.password = newPass;
    }

    getAge() {
        return this.age;
    }

    setAge(newAge: number) {
        this.age = newAge;
    }

    getInfoString() {
        return 'name: ' + this.user_name + ', age: ' + this.age + ', password: ' + this.password;
    }

    addUser() {
        console.log(this.user_name + 'to be added');
    }

    removeUser() {
        console.log(this.user_name + 'to be removed');
    }
}
