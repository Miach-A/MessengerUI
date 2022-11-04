
export class CreateChatDTO{
    constructor(contactName:string) {
        this.contactName = contactName;        
    }
    contactName:string = "";
}