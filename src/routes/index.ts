import { FastifyInstance } from "fastify";
import { dataRoutes } from "./data.routes";

export async function routes(app: FastifyInstance) {
    app.register(dataRoutes);
}
