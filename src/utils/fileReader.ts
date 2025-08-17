import path from "path";
import fs from "fs/promises";
import { RawBook } from "../types/data.types";

export async function readJsonFile<T>(
    filePath: string
): Promise<T> {
    try {
        const basePath = process.env.NODE_ENV
            ? path.join(process.cwd(), "src")
            : path.join(__dirname, "../");
        const absolutePath = path.join(basePath, filePath);
        const rawData = await fs.readFile(
            absolutePath,
            "utf8"
        );

        return JSON.parse(rawData) as T;
    } catch (error) {
        throw new Error(
            `Failed to read file ${filePath}: ${
                error instanceof Error
                    ? error.message
                    : String(error)
            }`
        );
    }
}

export async function readDataFile(): Promise<RawBook[]> {
    return readJsonFile<RawBook[]>("data/biblialivre.json");
}
