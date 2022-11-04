import { Contact } from "./Contact";

export class Chat{
    guid:string = "";
    name:string = "";
    public:boolean = false;
    users:Contact[] = new Array<Contact>; 

    constructor(obj?:Chat) {
        if (obj != null){
            this.guid = obj.guid;
            this.name = obj.name;
            this.public = obj.public;
            obj.users.forEach(element => {
                this.users.push(new Contact(element));        
            });
        }
    }
}