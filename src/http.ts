import express, { Router } from "express"
import { Handler, Provider } from "./handler"
import { Secret, SignOptions } from "jsonwebtoken"
import morgan from 'morgan'

export class Http {
    private readonly router: Router

    constructor(provider: Provider, secret: Secret, signOptions: SignOptions) { 
        this.router = express.Router()
        this.router.post('/sign', new HttpAuthHandler(provider, secret).asRouter(signOptions))
        this.router.get('/health', (_, res) => res.sendStatus(200))
    }

    publicKey(publicKey: JsonWebKey) {
        this.router.get('/key', (_, res) => {
            res.json(publicKey)
        })
    }

    start(port: number) {
        const app = express()
        app.use(express.json())
        app.use(morgan('combined'))
        app.use('/', this.router)
        app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
            console.error(err.stack)
            res.status(500).json({ ok: false, reason: 'internal server error' })
        })
        app.listen(port)
    }
}

type RouterFunc =
 (req: express.Request, res: express.Response, next: express.NextFunction) => void

class HttpAuthHandler extends Handler {
    asRouter(signOptions: SignOptions): RouterFunc {
        return async (req, res, next) => {
            try {
                return await this.s(req, res, signOptions)
            } catch(e) {
                return next(e as Error)
            }
        }
    }

    private async s(req: express.Request, res: express.Response, signOptions: SignOptions) {
        const isBodyValid = req.body.id && req.body.password
        if (!isBodyValid) {
            return res.status(400).json({
                ok: false,
                reason: "id or password are invaild."
            })
        }
        const signRes = await this.sign(req.body, signOptions)
        if (!signRes.ok) {
            return res.status(401).json(signRes)
        }
        return res.json(signRes)
    }
}
