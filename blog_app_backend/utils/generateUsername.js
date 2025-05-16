const { nanoid } = require("nanoid");

const generateUsername=(email)=>{
    const nameString = email.split("@")[0];
    const randomSuffix = nanoid(5)

    return `${nameString}@${randomSuffix}`
}

module.exports = generateUsername;