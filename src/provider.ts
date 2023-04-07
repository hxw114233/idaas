import { Ident, Provider, VerifyRes } from "./internal/handler";

const provider: Provider = {
    verify: function (ident: Ident): Promise<VerifyRes> {
        return Promise.resolve({ok: true})
    }
}

export default provider
