
export class CreateChatDTO{
    public contactName:string[] = [];
    public public:boolean = false;
    public name:string = "";

    constructor(contactName?:string[], name:string = "", isPublic:boolean = false) {
        if (contactName !== undefined){
            contactName.forEach(name => {
                this.contactName.push(name);    
            });       
        } 
        this.name = name;
        this.public = isPublic;     
    }

}