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

    // const cargaActual = useRef(50);
    // const palabrasPorCarga = 50;
    // const siguienteUrl = useRef(`/palabras?limite=${cargaActual.current}`);

    const cargarPalabras = async() => {

        // const resp = await palabrasApi.get<PalabrasResponse>(siguienteUrl.current);
        // setPalabras([ ...resp.data.palabras ]);

        // console.log(siguienteUrl.current);
        // cargaActual.current = cargaActual.current + palabrasPorCarga;
        // siguienteUrl.current = `/palabras?limite=${cargaActual.current}`;

        const resp = await palabrasApi.get<PalabrasResponse>('/palabras');
        setPalabras([ ...resp.data.palabras ]);
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