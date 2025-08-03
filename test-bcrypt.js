const bcrypt = require("bcrypt");

bcrypt.hash("12345678", 10).then(console.log);
