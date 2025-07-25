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

    async getBook(
        abrev: string
    ): Promise<Book | undefined> {
        try {
            this.data = await this.loadData();

            return this.data.find(
                (book) => book.abrev === abrev
            );
        } catch (err) {
            console.error(err);

            throw new Error("Erro ao procurar livro");
        }
    }
}
