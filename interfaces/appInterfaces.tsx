export interface PalabrasResponse {
    mostrando: number;
    total:     number;
    palabras:  Palabra[];
}

export interface Palabra {
    _id:         string;
    concepto:    string;
    significado: string;
    __v:         number;
}
