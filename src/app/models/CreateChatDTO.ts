
export class CreateChatDTO{
    public contactName:string[] = [];
    public public:boolean = false;
    public name:string = "";

    constructor(contactName?:string, name:string = "", isPublic:boolean = false) {
        if (contactName !== undefined){
            this.contactName.push(contactName);        
        } 
        this.name = name;
        this.public = isPublic;     
    }

}