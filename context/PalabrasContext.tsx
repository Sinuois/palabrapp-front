import { AxiosError } from "axios";
import React, { createContext, useEffect, useRef, useState } from "react";
import palabrasApi from "../api/palabrasApi";
import { Palabra, PalabrasResponse } from "../interfaces/appInterfaces";


type PalabrasContextProps = {
    palabras: Palabra[];
    cargarPalabras: () => Promise<void>;
    cargado: boolean;
    cantPalabras: number;
}

export const PalabrasContext = createContext({} as PalabrasContextProps);

export const PalabrasProvider = ({ children }: any ) => {

    const [palabras, setPalabras] = useState<Palabra[]>([]);
    const [cargado, setCargado] = useState(false);
    const [cantPalabras, setCantPalabras] = useState(0);

    useEffect(() => {
        cargarPalabras();
    }, [])

    const cargarPalabras = async() => {
        const resp = await palabrasApi.get<PalabrasResponse>('/palabras');
        setPalabras([ ...resp.data.palabras.reverse() ]);
        setCantPalabras(resp.data.palabras.length);
        setCargado(true);
    }



    return(
        <PalabrasContext.Provider value={{
            palabras,
            cargarPalabras,
            cargado,
            cantPalabras
        }}>
            { children }
        </PalabrasContext.Provider>
    )


}