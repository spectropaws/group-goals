import type { Context } from 'hono'
import { verify } from 'hono/jwt'

async function authenticate(ctx: Context, next: () => Promise<void>) {
    const authHeader = ctx.req.header('Authorization')
    if (!authHeader) {
        ctx.status(401)
        return ctx.json({ error: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
        ctx.status(403)
        return ctx.json({ error: 'Unauthorized' })
    }

    const SECRET_KEY: string | undefined = process.env.JWT_SECRET_KEY
    if (!SECRET_KEY) {
        ctx.status(500)
        return ctx.json({ error: 'Missing secret key' })
    }

    try {
        const user = await verify(token, SECRET_KEY)
        ctx.set('user', user)
    } catch (err) {
        ctx.status(403)
        return ctx.json({ error: 'Unauthorized' })
    }
    await next()
}

export default authenticate
