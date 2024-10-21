import { Hono } from "hono";
import type { Context } from "hono";
import { sign } from "hono/jwt";
import authenticate from "../middlewares/authentication";

const routes = new Hono()

routes.get("/", authenticate, async (c: Context) => {
    if (c.get('user')) {
        return c.json({ user: c.get('user') })        
    }
    else {
        return c.text("Unauthorized", 401)
    }
})


const users: { [key: string]: string } = {
    "JohnDoe": "password123",
    "JaneDoe": "password456"
}

routes.post("/login", async (c) => {
    const body = await c.req.json()
    const { username, password } = body
    
    // TODO: Verify from mongoDB
    if (!users[username]) {
        return c.text("Invalid username", 401)
    }
    if (users[username] !== password) {
        return c.text("Invalid password", 401)
    }
    // TODO: verify username and password structure using regex
    //
    const SECRET_KEY: string | undefined = process.env.JWT_SECRET_KEY;
    if (!SECRET_KEY) {
        return c.text("Missing secret key", 500)
    }
    const token = await sign({ username, password }, SECRET_KEY)
    return c.json({ token })
})

routes.post("/register", async (c) => {
    const user: { username: string, name: string, email: string, password: string } = await c.req.json()

    // TODO: Verify from mongoDB
    if (users[user.username]) {
        return c.text("Username already exists", 409)
    }
    users[user.username] = user.password
    c.status(200)
    return c.json({ success: true })
})

export default routes 
