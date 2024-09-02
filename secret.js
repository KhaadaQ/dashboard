const crypto = require("crypto");

const passwordSecret = "Proyecto de recuperación refresh";
const passwordSecret2 = "Si lees esto, espero que tengas un buen día refresh";

const hash = crypto
    .createHmac("sha256", passwordSecret)
    .update(passwordSecret2)
    .digest("hex");

    
console.log(hash);
