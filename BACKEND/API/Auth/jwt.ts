const jwt = require('jsonwebtoken')

class sessionToken {
    token: string;
    key: string | undefined;
    userID: number;

    constructor(token: string = '') {
        this.token = token;
        this.key = process.env.JWT_SECRET_KEY;
        this.userID = 0;

        if (this.key == undefined){
            this.token = '';
            this.userID = 0;
            this.key = '';
        }
    }

    signData(payload: Record<string, string | number>): string {
        if (this.key == ''){
            throw new Error("[ERROR] Key is not defined.");
        }



        const dataObject = {
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            iat: Math.floor(Date.now() / 1000) - 5,
            userID: payload['userID'],
            clientTime: payload['clientTime']
        }

        const token: string = jwt.sign(dataObject, this.key);
        return token;
    }

    verifyData(payload: Record<string, string | number>): boolean {
        return false;
    }


}
