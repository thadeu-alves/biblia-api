import { FastifyInstance } from "fastify";
import { allBooksRoute } from "./all-books.routes";
import { bookRoute } from "./book.routes";
import { chapterRoute } from "./chapter.routes";

export async function routes(app: FastifyInstance) {
    app.register(allBooksRoute);
    app.register(bookRoute);
    app.register(chapterRoute);
}
