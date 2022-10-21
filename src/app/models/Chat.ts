import { User } from "./User";

export class Chat{
    guid:string = "";
    name:string = "";
    public:boolean = false;
    users:User[] = new Array<User>; 
}