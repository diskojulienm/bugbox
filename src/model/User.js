export default class User {
    constructor(
        id,
        firstname,
        lastname,
        email
    ) {
        this.id        = id;
        this.firstname = firstname;
        this.lastname  = lastname;
        this.email     = email;
    }

    get fullName(){
        return this.firstname + ' ' + this.lastname;
    }

    get initials(){
        return this.firstname.charAt(0) + this.lastname.charAt(0);
    }
}
