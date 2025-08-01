import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { routes } from "./routes";

const app = fastify({
    logger: true,
});

app.register(fastifyCors, {
    origin: true,
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
});

app.register(routes);

const start = async () => {
    try {
        await app.listen({ port: 3000 });
        console.log(
            "Server listening on http://localhost:3000"
        );
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

export default async (req: any, res: any) => {
    try {
        await app.ready();
        app.server.emit("request", req, res);
    } catch (err) {
        console.error("Erro na função:", err);
        res.status(500).send("Internal Server Error");
    }
};

if (process.env.NODE_ENV !== "production") {
    start();
}
