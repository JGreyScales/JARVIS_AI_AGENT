const jwt = require('jsonwebtoken')

class sessionToken {
    token: string;
    key: string | undefined;
    userID: number;
    familyID: number;

    constructor(token: string = '') {
        this.token = token;
        this.key = process.env.JWT_SECRET || undefined;
        this.userID = 0;
        this.familyID = 0;

        if (this.key == undefined){
            this.token = '';
            this.userID = 0;
            this.familyID = 0;
            this.key = '';
        }
    }

    signData(payload: Record<string, string | number>): string {
        if (this.key == ''){
            console.log(process.env);
            throw new Error("[ERROR] Key is not defined.");
        }



        const dataObject = {
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            iat: Math.floor(Date.now() / 1000) - 5,
            userID: payload['userID'],
            familyID: payload['familyID'],
            clientTime: payload['clientTime']
        }

        this.token = jwt.sign(dataObject, this.key)
        return this.token;
    }

    verifyData(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            jwt.verify(this.token, this.key, (err: any, payload: { userID: number | null; familyID: number | null; }) => {
                if (err) return reject(false);
                if (payload.userID == null) return reject(false);
                if (payload.familyID == null) return reject(false);
                this.userID = payload.userID;
                this.familyID = payload.familyID;
                resolve(true);
            })
        })
    }


}

export default sessionToken