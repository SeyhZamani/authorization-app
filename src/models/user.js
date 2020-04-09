const validator = require('validator');

class User {
    constructor(id, email, passHash, createTime, updateTime) {
        if (!id || !validator.isUUID(id)) {
            throw new TypeError('User requires valid id');
        }
        if (!email || !validator.isEmail(email)) {
            throw new TypeError('User requires valid email');
        }
        if (!passHash) {
            throw new TypeError('User requires valid passHash');
        }
        this.id = id;
        this.email = email;
        this.passHash = passHash;
        this.createTime = createTime;
        this.updateTime = updateTime;
    }

    getID() {
        return this.id;
    }

    getPassHash() {
        return this.passHash;
    }

    getEmail() {
        return this.email;
    }
}

module.exports = {
    User,
};
