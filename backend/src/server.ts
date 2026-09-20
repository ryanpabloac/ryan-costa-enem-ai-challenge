import { registerRoutes } from "@/routes/index.js";
import { App } from "@/app.js";
import { env } from "@/config/env.js";
import { connectDatabase, disconnectDatabase } from "@/config/mongodb.js";

async function startServer(app: App) {
    await connectDatabase();
    await registerRoutes(app.getInstance());
    app.start(env.HOST, env.PORT);
}

async function closeServer(app: App) {
    await disconnectDatabase();
    await app.finish();
}

const app = new App();

process.on('SIGTERM', () => closeServer(app));
process.on('SIGINT', () => closeServer(app));

app.setupApp().then(app => {
    startServer(app);
});