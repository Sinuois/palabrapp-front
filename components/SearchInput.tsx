import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { Platform, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { useDebouncedValue } from '../hooks/useDebouncedValue';

interface Props {
    onDebounce: ( value: string ) => void;
    style?: StyleProp<ViewStyle>
}

export const SearchInput = ({ style, onDebounce }: Props) => {

    const isFocused = useIsFocused();
    useEffect(() => {
        //Cada vez que se muestre la pantalla
        setTextValue('');

    }, [isFocused]);   

    const [textValue, setTextValue] = useState('');

    //El debounce sirve para que no se mande la solicitud por cada letra que se escriba en el input,
    //sino que, al dejar de escribir, va a pasar un ratito (se puso medio segundo)
    const debouncedValue = useDebouncedValue( textValue );

    useEffect(() => {
      onDebounce(debouncedValue);
    
    }, [debouncedValue])
    

    return (
    <View style={{
        ...styles.container,
        ...style as any
    }}>
        <View style={ styles.textBackground }>
            <TextInput 
                placeholder='Buscar concepto'
                placeholderTextColor={'grey'}
                style={{ 
                    ...styles.textInput,
                    top: (Platform.OS === 'ios') ? 0 : 2 
                }}
                autoCapitalize="none"
                autoCorrect={false}
                value={ textValue }
                onChangeText={ setTextValue }
                maxFontSizeMultiplier={1}
            />
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        
    },
    textBackground: {
        backgroundColor: '#F3F1F3',
        borderRadius: 50,
        height: 40,
        maxHeight: 40,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    textInput: {
        flex: 1,
        fontSize: 18,
        maxHeight: 40,
        top: 2,
        color: 'black'
    }
})
