import { Secret, SignOptions } from "jsonwebtoken"
import { Http, HttpAuthHandler } from "./http"
import provider from "../provider"

export type ServerConfig = {
    port: number
}

export type SignConfig = {
    secret: Secret,
    signOptions: SignOptions,
    publicKey?: JsonWebKey | undefined
}

export const runner = async (serverConfig: ServerConfig, signConfig: SignConfig) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authHandler = new HttpAuthHandler(provider as any, signConfig.secret)
    const server = new Http(authHandler, signConfig.signOptions)
    if (signConfig.publicKey) {
        server.publicKey(signConfig.publicKey)
    }
    server.start(serverConfig.port)
}
