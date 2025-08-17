export interface RawBook {
    id: string;
    periodo: string;
    nome: string;
    abrev: string;
    capitulos: [[string]];
}

export interface Book {
    id: string;
    periodo: string;
    nome: string;
    abrev: string;
    capitulos: number;
}
