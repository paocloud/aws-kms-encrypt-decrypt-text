const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

const kmsClient = new AWS.KMS({
    region: 'ap-southeast-1',
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
});

async function encryptString(text) {

    const paramsEncrypt = {
        KeyId: 'arn:aws:kms:ap-southeast-1:<aws_account_id>:key/85d4286c-aaaa-41eb-88ea-xxxxxx',
        Plaintext: new Buffer.from(text)
    };

    const encryptResult = await kmsClient.encrypt(paramsEncrypt).promise();
    if (Buffer.isBuffer(encryptResult.CiphertextBlob)) {
        return Buffer.from(encryptResult.CiphertextBlob).toString('base64');
    } else {
        throw new Error('error');
    }
}

async function decryptEncodedstring(encoded) {
 
    const paramsDecrypt = {
        CiphertextBlob: Buffer.from(encoded, 'base64')
    };
 
    const decryptResult = await kmsClient.decrypt(paramsDecrypt).promise();
    if (Buffer.isBuffer(decryptResult.Plaintext)) {
        return Buffer.from(decryptResult.Plaintext).toString();
    } else {
        throw new Error('error');
    }
}


async function main() {
    const mySuperSecretText = "aws";

    console.log(`String before encrypt : ${mySuperSecretText}`);
    let encryptMySecureText = await encryptString(mySuperSecretText);
    console.log("\n\nEncrypted string : " + encryptMySecureText);

    let decryptMySecureText = await decryptEncodedstring(encryptMySecureText);
    console.log("\n\nDecrypted string : " + decryptMySecureText);
}

main();
