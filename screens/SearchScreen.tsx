import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Espaciador } from '../components/Espaciador';
import { SearchInput } from '../components/SearchInput';
import { PalabrasContext } from '../context/PalabrasContext';
import { Palabra } from '../interfaces/appInterfaces';

const screenWidth = Dimensions.get('window').width;

interface Props extends StackScreenProps<any, any>{};

export const SearchScreen = ({ navigation }: Props) => {

    const { top } = useSafeAreaInsets();
    const [term, setTerm] = useState('');

    const [textValue, setTextValue] = useState('');

    const { palabras } = useContext( PalabrasContext );
    const [conceptosFiltrados, setConceptosFiltrados] = useState<Palabra[]>([]);

    const normalizar = (str: String) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
    }



    useEffect(() => {
        if (term.length === 0) return setConceptosFiltrados([]); //Si no se busca nada, no habrá conceptos filtrados
        if ( isNaN( Number(term) ) ) { //Si la búsqueda no es número, se busca por nombre
            setConceptosFiltrados(
                palabras.filter( palabra => normalizar(palabra.concepto)
                    .includes( normalizar(term)) )
            )
        }

    }, [term]); 
    

    return (
        <View style={{
            flex: 1,
            marginTop: (Platform.OS === 'ios') ? top : top + 10,
            marginHorizontal: 20
        }}>
            <SearchInput 
                onDebounce={ (value) => setTerm( value )}
                style={{
                    position: 'absolute',
                    zIndex: 999,
                    width: screenWidth - 40,
                    top: ( Platform.OS === 'ios' ) ? top: top + 30
                }}
            />
            <Espaciador orientacion={'vertical'} espaciado={100} />

            <FlatList 
                data={ conceptosFiltrados }
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

            />                        
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
        borderBottomColor: 'rgba(255,255,255,0.8)'
    },
});
