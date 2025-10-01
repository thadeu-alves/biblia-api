import { FastifyInstance } from "fastify";
import { DataService } from "../services/data.services";
import { allBooksSchema } from "../utils/schemas";
import { Book } from "../types/data.types";

export async function allBooksRoute(app: FastifyInstance) {
    const dataService = new DataService();

    app.get(
        "/livros",
        {
            schema: { ...allBooksSchema },
        },
        async (_, reply) => {
            try {
                const rawData =
                    await dataService.loadData();

                const seenId = new Set();
                const data: Book[] = Array.from(
                    rawData.values()
                )
                    .map((rBook) => {
                        const book: Book = {
                            ...rBook,
                            capitulos:
                                rBook.capitulos.length,
                        };

                        return book;
                    })
                    .filter((book) => {
                        if (!seenId.has(book.id)) {
                            seenId.add(book.id);
                            return true;
                        }
                        return false;
                    });

                return reply.status(200).send({
                    data: Array.from(data.values()),
                });
            } catch (err) {
                console.log(err);

                return reply.status(500).send({
                    error: "Erro interno no servidor.",
                });
            }
        }
    );
}
