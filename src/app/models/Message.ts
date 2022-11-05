export class Message{
    date:Date = new Date();
    guid:string = "";
    chatGuid:string = "";
    contactName:string = "";
    commentedMessage?:Message;
    text:string = "";

    constructor(obj?:Message) {
        if (obj != null){
            this.date = obj.date;
            this.guid = obj.guid;
            this.chatGuid = obj.chatGuid;
            this.contactName = obj.contactName;
            if (!!obj.commentedMessage){
                this.commentedMessage = new Message(obj.commentedMessage as Message);
            }
            this.text = obj.text;
        }
    }
}