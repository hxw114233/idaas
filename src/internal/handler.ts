import * as jwt from 'jsonwebtoken'

export class Handler {
    constructor(private provider: Provider, private secret: jwt.Secret) { }

    async sign(ident: Ident, signOptions: jwt.SignOptions): Promise<AuthRes> {
        const verifyRes = await this.provider.verify(ident)
        if (!verifyRes.ok) {
            return verifyRes
        }
        const token = jwt.sign({ id: ident.id }, this.secret, signOptions)
        return { ok: true, token }
    }
}

export interface Provider {
    verify: (ident: Ident) => Promise<VerifyRes>
}

export type Ident = {
    id: string,
    password: string
}

export type HandlerError = {
    ok: false,
    reason: string
}

export type VerifyRes =
    | { ok: true }
    | HandlerError

export type AuthRes =
    | { ok: true, token: string } 
    | HandlerError
