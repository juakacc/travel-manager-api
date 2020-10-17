const bcrypt = require("bcryptjs");

// console.log(bcrypt.hashSync("mikael", 10));
console.log(bcrypt.compareSync("mikael", "$2a$10$deDO6Aw6dzEbKgMqMDC6uu2oKu4TL5V6K95td1Ju6vQmKCvaiN1hy"))