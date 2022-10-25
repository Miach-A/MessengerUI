export class Contact{
    name:string = "";
    firstName:string = "";
    lastName:string = "";
    phoneNumber = "";

    constructor(obj?:Contact) {
      if (obj != null){
        this.name = obj.name;
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.phoneNumber = obj.phoneNumber;
      }  

    }
}