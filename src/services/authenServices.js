require("../.env")
async function jwtGenerate(user){
    const { createSecretKey } = require('crypto');
    const secretKey = createSecretKey(JWT_SECRET ,'utf-8')
    console.log(secretKey);
    const jwe = await new jose.CompactEncrypt(
        new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
      )
        .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
        .encrypt(publicKey)
      
    return jwe;
}


module.exports = {
    jwtGenerate,
  };