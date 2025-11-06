const StringStore = require('../constants/constants')

// 📌 Function to verify inputs
const isEmpty = (value) => {
    return value === null || value === undefined || value.toString().trim() === "";
};

// 📌 Generate user code
const generateUserCode = () => {
    const letters = StringStore.ALPHA_LETTERS;
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return code;
};


// 📌 Exporting all functions
module.exports = {isEmpty,generateUserCode}