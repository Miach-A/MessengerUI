export class AddChatUserDTO{
    public guid:string;
    public contactName:string[];
    constructor(guid:string, contactName:string[]) {
        this.guid = guid;  
        this.contactName = contactName;              
    }
}