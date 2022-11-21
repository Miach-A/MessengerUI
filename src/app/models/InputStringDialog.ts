export class InputStringDialog{

    private _string:string = "";
    private _title:string = "";
    constructor(title:string) {
        this._title = title;      
    }

    public set string(string:string){
        this._string = string;
    }

    public get string(){
        return this._string;
    }

    public get title(){
        return this._title;
    }
}