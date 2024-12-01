class User {
    #id;
    #userName;
    #hash_password;
    #email;
    #fullName;
    #contact;
    #address;

    constructor(id, userName, hash_password, email, fullName = null, contact = null, address = null) {
        this.#id = id;
        this.#userName = userName;
        this.#hash_password = hash_password;
        this.#email = email;
        this.#fullName = fullName;
        this.#contact = contact;
        this.#address = address;
    }

    // Getter methods
    getId() {
        return this.#id;
    }

    getUserName() {
        return this.#userName;
    }

    getHashPassword() {
        return this.#hash_password;
    }

    getEmail() {
        return this.#email;
    }

    getFullName() {
        return this.#fullName;
    }

    getContact() {
        return this.#contact;
    }

    getAddress() {
        return this.#address;
    }
}
let user = new User(1);
console.log(user.getId());
