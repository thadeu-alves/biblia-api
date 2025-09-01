import {
    vi,
    describe,
    beforeEach,
    it,
    expect,
    Mocked,
    MockedFunction,
    Mock,
} from "vitest";
import { readDataFile } from "../utils/fileReader";
import { DataService, IDataService } from "./data.services";
import Redis from "ioredis";
import { Book, RawBook } from "../types/data.types";

type RedisMock = Mocked<Redis> & {
    get: MockedFunction<Redis["get"]>;
    set: MockedFunction<Redis["set"]>;
};

vi.mock("../utils/fileReader", () => ({
    readDataFile: vi.fn(),
}));

vi.mock("ioredis", () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            get: vi.fn(),
            set: vi.fn(),
        })),
    };
});

describe("Data Services Testes", () => {
    let dataService: IDataService;
    let redisMock: RedisMock;

    beforeEach(() => {
        redisMock = {
            get: vi.fn(),
            set: vi.fn(),
        } as unknown as RedisMock;

        dataService = new DataService();

        (Redis as unknown as Mock).mockImplementation(
            () => redisMock
        );

        vi.clearAllMocks();
    });

    it("Retorno direto do this.data", async () => {
        const fakeBooks: Book[] = [
            {
                id: "1",
                abrev: "gn",
                nome: "Genesis",
                capitulos: 50,
                periodo: "AT",
            },
        ];

        dataService.setData(fakeBooks);

        const result = await dataService.loadData();

        expect(result).toEqual(fakeBooks);
        expect(redisMock.get).not.toHaveBeenCalled();
        expect(readDataFile).not.toHaveBeenCalled();
    });

    it("Carregamento do Redis", async () => {
        const fakeBooks: Book[] = [
            {
                id: "1",
                abrev: "gn",
                nome: "Genesis",
                capitulos: 50,
                periodo: "AT",
            },
        ];

        redisMock.get.mockResolvedValueOnce(
            JSON.stringify(fakeBooks)
        );

        const result = await dataService.loadData();

        expect(result).toEqual(fakeBooks);
        expect(redisMock.get).toBeCalledWith("data");
        expect(readDataFile).not.toHaveBeenCalled();
    });

    it("Sem cache", async () => {
        const rawFakeBooks: RawBook[] = [
            {
                id: "1",
                abrev: "gn",
                nome: "Genesis",
                capitulos: [[""]],
                periodo: "AT",
            },
        ];

        const fakeBooks: Book[] = [
            {
                id: "1",
                abrev: "gn",
                nome: "Genesis",
                capitulos: 1,
                periodo: "AT",
            },
        ];

        (readDataFile as any).mockResolvedValueOnce(
            rawFakeBooks
        );
        redisMock.get.mockResolvedValueOnce(null);

        const result = await dataService.loadData();

        expect(result).toEqual(fakeBooks);
        expect(readDataFile).toHaveBeenCalled();
        expect(redisMock.set).toBeCalledWith(
            "data",
            JSON.stringify(fakeBooks)
        );
    });
});
