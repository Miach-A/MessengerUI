export class UpdateMessageDTO{
    date:Date = new Date();
    guid:string = "";
    chatGuid:string = "";
    text:string = "";

    constructor(updateMessageDTO?: UpdateMessageDTO) {
        if (updateMessageDTO != undefined) {
            this.date = updateMessageDTO.date;
            this.guid = updateMessageDTO.guid;
            this.chatGuid = updateMessageDTO.chatGuid;
            this.text = updateMessageDTO.text;
        }
    }
}