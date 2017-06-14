const User = require('../Database/database.controller');


function getUserByUid(uid) {
    await User.findOne({where : { uid : uid}});
}
