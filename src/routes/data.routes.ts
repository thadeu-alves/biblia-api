import { FastifyInstance } from "fastify";
import { DataService } from "../services/data.services";

export async function dataRoutes(app: FastifyInstance) {
    const dataService = new DataService();

    app.get("/", async () => {
        return dataService.loadData();
    });
}
