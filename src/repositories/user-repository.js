const moment = require('moment');
const db = require('../utils/database').getDB();
const { mapToUser } = require('../mappers/user-record-to-user-object-mapper');

class UserRepository {
    create(email, passHash) {
        return db('user')
            .returning('*')
            .insert({
                email,
                pass_hash: passHash,
                create_time: moment().utc(),
                update_time: moment().utc(),
            }).then((r) => r.map(mapToUser));
    }

    findByEmail(email) {
        return db('user')
            .where({
                email,
            })
            .first()
            .then((r) => r ? mapToUser(r) : undefined);
    }
}

module.exports = UserRepository;
