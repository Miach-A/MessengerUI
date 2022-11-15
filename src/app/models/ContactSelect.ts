import { ChatEvent } from "./ChatEvent";
import { Contact } from "./Contact";
import { Message } from "./Message";
import { UpdateMessageDTO } from "./UpdateMessageDTO";

export class ContactSelect{

  private _select:boolean = false;

    constructor(private _contact:Contact) {
    }

    public Switch():void{
        this._select = !this._select;
    }

    public GetContact():Contact{
        return this._contact;
    }

    public Selected():boolean{
      return this._select;
    }
}

