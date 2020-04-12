const moment = require('moment');
const dbAdapter = require('../utils/database');
const { mapToUser } = require('../mappers/user-record-to-user-object-mapper');

class UserRepository {
    create(email, passHash) {
        const db = dbAdapter.getDB();
        return db('user')
            .returning('*')
            .insert({
                email,
                pass_hash: passHash,
                create_time: moment().utc(),
                update_time: moment().utc(),
            })
            .then((r) => r.map(mapToUser))
            .then((r) => r[0]);
    }

    findByEmail(email) {
        const db = dbAdapter.getDB();
        return db('user')
            .where({
                email,
            })
            .first()
            .then((r) => r ? mapToUser(r) : undefined);
    }
}

module.exports = UserRepository;
