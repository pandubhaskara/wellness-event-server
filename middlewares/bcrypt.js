const bcrypt = require('bcryptjs');

function encrypt(rawPass) {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(rawPass, saltRounds);
    return hash;
};
function checkPass(rawPass, hashedPass) {
    return bcrypt.compareSync(rawPass, hashedPass);
};

module.exports = { encrypt,checkPass }