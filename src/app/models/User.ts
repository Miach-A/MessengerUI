import { Chat } from "./Chat";
import { Contact } from "./Contact";

export class User{
    name:string = "";
    firstName:string = "";
    lastName:string = "";
    phoneNumber = "";
    chats:Chat[] = new Array<Chat>;
    contacts:Contact[] = new Array<Contact>;
 }