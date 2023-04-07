import { readFileSync } from "fs"
import path from "path"

export default {
    server: {
        port: process.env.PORT
    },
    sign: {
        secret: readFileSync(path.join(__dirname, '.key', 'private-key.pem')),
        signOptions: {
            algorithm: "RS256",
            expiresIn: "7d",
            issuer: process.env.HOST
        },
        publicKey: require(path.join(__dirname, '.key', 'jwk.json'))
    }
}
