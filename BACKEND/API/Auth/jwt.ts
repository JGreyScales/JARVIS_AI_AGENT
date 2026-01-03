const jwt = require('jsonwebtoken')

class sessionToken {
    token: string;
    key: string | undefined;
    userID: number;

    constructor(token: string = '') {
        this.token = token;
        this.key = process.env.JWT_SECRET_KEY || undefined;
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

        this.token = jwt.sign(dataObject, this.key)
        return this.token;
    }

    verifyData(payload: Record<string, string | number>): Promise<boolean> {
        return new Promise((resolve, reject) => {
            jwt.verify(this.token, this.key, (err: any, payload: { userID: number | null; }) => {
                if (err) return reject(false);
                if (payload.userID == null) return reject(false)
                this.userID = payload.userID;
                resolve(true);
            })
        })
    }


}
