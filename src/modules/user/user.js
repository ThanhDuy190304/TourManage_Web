class User {
    #id;
    #userName;
    #hash_password;
    #email;
    #fullName;
    #contact;
    #address;
    #salt
    #role
    constructor(id, userName, hash_password, email, salt, role, fullName = null, contact = null, address = null) {
        this.#id = id;
        this.#userName = userName;
        this.#hash_password = hash_password;
        this.#email = email;
        this.#salt = salt;
        this.#role = role;
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
    getRole() {
        return this.#role;
    }
    getSalt() {
        return this.#salt;
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

module.exports = User;
