const logger = require('../utils/logger');
const { User } = require('../models/user');

const mapToUser = (record) => {
    logger.info('User Obj is being built from db record');
    const {
        id,
        email,
        pass_hash,
        create_time,
        update_time
    } = record;
    return new User(id, email, pass_hash, create_time, update_time);
};

module.exports = {
    mapToUser,
};
