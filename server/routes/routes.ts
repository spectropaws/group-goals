import { Hono } from "hono";

const routes = new Hono()

routes.get("/", (c) => c.text("Home route"))

routes.get("/login", (c) => c.text("Login route"))

routes.get("/register", (c) => c.text("Register route"))

export default routes 
