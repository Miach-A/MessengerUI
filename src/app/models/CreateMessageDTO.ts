export class CreateMessageDTO{
    chatGuid:string = "";
    commentedMessageGuid?:string;
    commentedMessageDate?:Date; 
    text:string = "";
}