import { registerRoutes } from "@/routes/index.js";
import { App } from "@/app.js";
import { env } from "@/config/env.js";

async function startServer(app: App) {
    await registerRoutes(app.getInstance());
    app.start(env.HOST, env.PORT);
}

const app = new App().setupApp().then(app => {
    startServer(app);
});