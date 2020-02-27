import jwt from 'jsonwebtoken';
import * as ethUtil from 'ethereumjs-util';
import ethSigUtil from 'eth-sig-util';
import tokenConfig from './config/token.json';

const createToken = (publicAddress: string): Promise<string> => {
    return new Promise((resolve, reject) => {

        let payload = {
            publicAddress: publicAddress
        };

        let options = {
            expiresIn: tokenConfig.expire
        };

        jwt.sign(payload, tokenConfig.secret, options, (error, token) => {

            if(error) reject(error);
            resolve(token);

        });

    });
};

const getToken = (signature: string, publicAddress: string, nonce: string): Promise<{ auth: boolean, token: string }> => {
    return new Promise(async (resolve) => {

        const nonceBufferHex = ethUtil.bufferToHex(Buffer.from(nonce, 'utf8'));
        let address: string;

        try {

            address = ethSigUtil.recoverPersonalSignature({
                data: nonceBufferHex,
                sig: signature
            });

            if(address.toLowerCase() !== publicAddress.toLowerCase()) {
                resolve({
                    auth: false,
                    token: ''
                });
                return;
            }

            const token: string = await createToken(publicAddress);

            resolve({
                auth: true,
                token: token
            });

        } catch(error) {

            resolve({
                auth: false,
                token: ''
            });

        }

    });
};

const auth = async (signature: string, publicAddress: string, nonce: string) => {

    return await getToken(signature, publicAddress, nonce);

};

// lambda
exports.handler = async (event: any) => {

    const signature = event['signature'];
    const publicAddress = event['publicAddress'];
    const nonce = event['nonce'];

    if(typeof signature != "string" || typeof publicAddress != "string" || typeof nonce != "string") {
        return {
            error: 'error'
        };
    }

    return await auth(signature, publicAddress, nonce);

};
