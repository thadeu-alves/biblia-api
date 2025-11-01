import Redis from "ioredis";
import {
    Book,
    Chapter,
    RawBook,
} from "../types/data.types";
import { readDataFile } from "../utils/fileReader";
import "dotenv/config";
import { da } from "zod/v4/locales/index.cjs";

export interface IDataService {
    setData(data: Map<string | number, RawBook>): void;
    loadData(): Promise<Map<string | number, RawBook>>;
    getBook(id: string | number): Promise<Book | undefined>;
    getBookChapter(
        id: number | string,
        chapterId: number,
    ): Promise<Chapter>;
    getSingleVerse(
        id: number | string,
        chapter: number,
        verse: number,
    ): Promise<string>;
    getVersesRange(
        id: string | number,
        chapter: number,
        start: number,
        end: number,
    ): Promise<string[]>;
}

export class DataService implements IDataService {
    private data: Map<string | number, RawBook>;
    protected redis: Redis;

    constructor() {
        this.data = new Map<string | number, RawBook>();
        this.redis = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
        });
    }

    setData(data: Map<string | number, RawBook>) {
        this.data = data;
    }

    async loadData(): Promise<
        Map<string | number, RawBook>
    > {
        try {
            if (Array.from(this.data.values()).length > 0) {
                return this.data;
            }
            // const redisRaw = await this.redis.get("data");

            // if (redisRaw) {
            //     const redisData = JSON.parse(
            //         redisRaw
            //     ) as Map<string | number, Book>;
            //     this.data = redisData;
            //     return this.data;
            // }

            const rawData = await readDataFile();

            if (!rawData) {
                throw new Error("Falha ao ler arquivo.");
            }

            rawData.map((rbook) => {
                this.data.set(rbook.id, rbook);
                this.data.set(rbook.abrev, rbook);
            });

            this.redis.set(
                "data",
                JSON.stringify(this.data),
            );

            return this.data || new Map();
        } catch (err) {
            console.error(err);

            throw new Error("Failed to load data");
        }
    }

    async getBook(
        id: string | number,
    ): Promise<Book | undefined> {
        try {
            this.data = await this.loadData();

            const book = this.data.get(id);

            if (!book) {
                throw new Error("Livro não encontrado.");
            }

            return {
                ...book,
                capitulos: book?.capitulos.length || 0,
            };
        } catch (err) {
            console.error(err);

            throw new Error("Erro ao procurar livro");
        }
    }

    async getBookChapter(
        id: number | string,
        chapterId: number,
    ): Promise<Chapter> {
        try {
            this.data = await this.loadData();

            const book = this.data.get(id);

            if (!book)
                throw new Error("Livro não encontrado");

            const chapter = book.capitulos[chapterId];

            if (!chapter)
                throw new Error("Capítulo não encontrado");

            return {
                verses: chapter,
                hasNext: book.capitulos[chapterId + 1]
                    ? true
                    : false,
                hasPrevious: book.capitulos[chapterId - 1]
                    ? true
                    : false,
            };
        } catch (err) {
            console.error(err);

            throw new Error("Erro ao retornar capitulos");
        }
    }

    async getSingleVerse(
        id: number | string,
        chapter: number,
        verse: number,
    ): Promise<string> {
        try {
            const chap = await this.getBookChapter(
                id,
                chapter,
            );
            return chap.verses[verse];
        } catch (err) {
            console.error(err);

            throw new Error("Erro ao retornar versiculo");
        }
    }

    async getVersesRange(
        id: string | number,
        chapter: number,
        start: number,
        end: number,
    ): Promise<string[]> {
        try {
            const chap = await this.getBookChapter(
                id,
                chapter,
            );

            return chap.verses.slice(start, end);
        } catch (err) {
            console.error(err);

            throw new Error("Erro ao retornar versiculos");
        }
    }
}
