import React from 'react'
import { View } from 'react-native'

interface Props { 
    orientacion: 'vertical' | 'horizontal';
    espaciado: number;
}

export const Espaciador= ( { orientacion, espaciado }: Props ) => {
    return (
        <>
            {
                ( orientacion === 'vertical' ) ? (
                    <View style={{ 
                        height: espaciado,
                    }} />
                ) : (
                    <View style={{ 
                        width: espaciado,
                    }} />            
                )
            }
        </>
    )
}
