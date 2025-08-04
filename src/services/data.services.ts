import { Book } from "../types/data.types";
import { readDataFile } from "../utils/fileReader";

export class DataService {
    private data: Book[] | null = null;

    async loadData(): Promise<Book[]> {
        try {
            if (this.data) return this.data;

            this.data = await readDataFile();

            return this.data;
        } catch (err) {
            console.error(err);

            throw new Error("Failed to load data");
        }
    }

    async getBooksAbrev(): Promise<
        Pick<Book, "abrev" | "id" | "nome">[]
    > {
        try {
            this.data = await this.loadData();
            const filtered = this.data.map(
                ({ abrev, id, nome }) => ({
                    abrev,
                    id,
                    nome,
                })
            );

            return filtered;
        } catch (err) {
            console.error(err);

            throw new Error("Erro ao retornar abreviações");
        }
    }

    async getBook(
        id: string | number
    ): Promise<Book | undefined> {
        try {
            this.data = await this.loadData();

            if (typeof id === "number") {
                return this.data[id];
            }

            return this.data.find(
                (book) => book.abrev === id
            );
        } catch (err) {
            console.error(err);

            throw new Error("Erro ao procurar livro");
        }
    }

    async getBookChapter(
        id: number | string,
        chapter: number
    ): Promise<string[]> {
        try {
            const book = await this.getBook(id);
            return book?.capitulos[chapter] || [];
        } catch (err) {
            console.error(err);

            throw new Error("Erro ao retornar capitulos");
        }
    }
}
