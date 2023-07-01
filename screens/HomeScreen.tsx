import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';

import { PalabrasContext } from '../context/PalabrasContext';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from 'react-native-splash-screen'
import { useFocusEffect } from '@react-navigation/native';

interface Props extends StackScreenProps<any, any>{};

export const HomeScreen = ({ navigation }: Props) => {

    const [ isRefreshing, setIsRefreshing ] = useState( false );
    const { palabras, cargarPalabras, cantPalabras } = useContext( PalabrasContext );
    const [ ordenPalabras, setOrdenPalabras ] = useState( 'Abc' );

    const cargarPalabrasDelBackend = async() => {
        
        setIsRefreshing(true);
        await cargarPalabras();
        setIsRefreshing(false); 
    }

    const cambiarOrden = async() => {
        if (ordenPalabras === 'Abc') {
            setOrdenPalabras('New');
            setIsRefreshing(true);
            await cargarPalabras();
            setIsRefreshing(false); 
        } 
        if (ordenPalabras === 'New') setOrdenPalabras('Zyx');
        if (ordenPalabras === 'Zyx') setOrdenPalabras('Abc');
    }

    useFocusEffect(
        React.useCallback(() => {
            cargarPalabrasDelBackend();
            return () => {
                // Limpia los efectos o suscripciones si es necesario
            };
        }, [])
    );

    useEffect(() => {
        SplashScreen.hide();
    }, []);

    switch(ordenPalabras) { 
        case 'Abc': { 
            palabras.sort((a, b) => a.concepto.localeCompare(b.concepto));
            break; 
        } 
        case 'Zyx': { 
            palabras.sort((b, a) => a.concepto.localeCompare(b.concepto));
            break; 
        } 
    } 

    return (
        <View style={{ flex: 1, marginHorizontal: 10 }}>
            {
                <View style={{ flex: 1}}> 
                    <FlatList 
                        data={ palabras }
                        keyExtractor={ (p) => p._id }
                        showsVerticalScrollIndicator={false}
                        renderItem={ ({item}) => (
                            <TouchableOpacity
                                activeOpacity={ 0.8 }
                                onPress={ 
                                    () => navigation.navigate('PalabraScreen', {
                                        id: item._id,
                                        concepto: item.concepto,
                                        significado: item.significado
                                    }) 
                                }
                            >
                                <Text style={ styles.concepto }>{ item.concepto }</Text>
                            </TouchableOpacity>
                        )}
                        
                        ItemSeparatorComponent={ () => (
                            <View style={ styles.itemSeparator } />
                        )}

                        refreshControl={
                            <RefreshControl 
                                refreshing={ isRefreshing }
                                onRefresh={ cargarPalabrasDelBackend }
                                colors={['green', '#4287f5']}
                            />
                        }
                    
                    />
                    <TouchableOpacity
                        activeOpacity={ 0.8 }
                        onPressIn={ cambiarOrden }
                    >
                        <View style={{...styles.botonFlotante, backgroundColor: '#ffad33', bottom: 620, width: 70}}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                                { ordenPalabras }
                            </Text>
                        </View>  

                    </TouchableOpacity>                      
                      
                    
                    <View style={{...styles.botonFlotante, backgroundColor: '#02ac66', bottom: 180, width: 70}}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                            {cantPalabras}
                        </Text>
                    </View>                    

                    <TouchableOpacity
                        activeOpacity={ 0.8 }
                        onPressIn={ () => navigation.navigate('PalabraScreen', {}) }
                    >
                        <View style={{...styles.botonFlotante, backgroundColor: '#4287f5'}}>
                        <Icon
                            name="add-outline"
                            size={ 35 }
                            color="white"
                            style={{ left: 1 }}
                        />
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={ 0.8 }
                        onPressIn={ cargarPalabrasDelBackend }
                    >
                        <View style={{...styles.botonFlotante, backgroundColor: '#5856D6', bottom: 70}}>
                            <Icon
                                name="refresh-outline"
                                size={ 35 }
                                color="white"
                                style={{ left: 1 }}
                            />
                            </View>   

                        <View style={{ height: 65}} />

                    </TouchableOpacity>            
                </View>
        }
        </View>
    )
}

const styles = StyleSheet.create({
    concepto: {
        fontSize: 20,
        color: 'white'
    },
    itemSeparator: {
        borderBottomWidth: 2,
        marginVertical: 5,
        borderBottomColor: 'rgba(255,255,255,0.5)',
    },
    botonFlotante: {
        position: 'absolute',
        bottom: 60,
        right: 20,
        zIndex: 9999,
        height: 50,
        width: 50,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        
        elevation: 6,

    }
});

