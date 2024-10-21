import { Hono } from 'hono'
import routes from './routes/routes'

const port = process.env.PORT || 8000

const app = new Hono()

app.route("/", routes)

export default {
    fetch: app.fetch,
    port: port
}
