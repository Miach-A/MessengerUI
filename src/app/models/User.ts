import { Chat } from "./Chat";
import { Contact } from "./Contact";

export class User{
    name:string = "";
    firstName:string = "";
    lastName:string = "";
    phoneNumber = "";
    chats:Chat[] = new Array<Chat>;
    contacts:Contact[] = new Array<Contact>;
    testString:string = "dd";

    constructor(obj?:User) {
        if (obj != null){
            this.name = obj.name;
            this.firstName = obj.firstName;
            this.lastName = obj.lastName;
            this.phoneNumber = obj.phoneNumber;
            obj.chats.forEach(element => {
                this.chats.push(new Chat(element))   
            });
            obj.contacts.forEach(element => {
                this.contacts.push(new Contact(element))   
            });
        }
    }
 }