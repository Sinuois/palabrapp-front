import { StackScreenProps } from '@react-navigation/stack'
import { AxiosError } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import palabrasApi from '../api/palabrasApi'
import { Espaciador } from '../components/Espaciador'
import { PalabrasContext } from '../context/PalabrasContext'
import { useForm } from '../hooks/useForm'
import { Palabra } from '../interfaces/appInterfaces'
import { RootStackParams } from '../navigator/TabLista'

interface Props extends StackScreenProps<RootStackParams, 'PalabraScreen'>{};

export const PalabraScreen = ({ navigation, route }: Props)=> {

    const [palabras, setPalabras] = useState<Palabra[]>([]);

    const { id = '', concepto = '' } = route.params;

    const [signficadoActualizado, setSignficadoActualizado] = useState('');

    const [modoEdicion, setModoEdicion] = useState(false);

    const [cargado, setCargado] = useState(false);

    const [modalBorrar, setModalBorrar] = useState(false);

    const { _id, conceptoForm, significadoForm = '', form, onChange, setFormValue } = useForm({
        _id: id,
        conceptoForm: concepto,
        significadoForm: signficadoActualizado 
    });

    useEffect(() => {
        //A veces se podría ingresar a una palabra que haya sido borrado segundos antes
        verificar();
    }, [])
    


    const [errorTomado, setErrorTomado] = useState("");

    const [existe, setExiste] = useState(true);

    const verificar = async() => {
        try {
            const resp = await palabrasApi.get<Palabra>(`/palabras/${ id }`);
            setSignficadoActualizado( resp.data.significado );
            const formulario = form;
            formulario.significadoForm = resp.data.significado;
            setFormValue(formulario);

        } catch (error) {
            const err = error as AxiosError
            if (err.response) {
                setErrorTomado(err.response.data.msg);
                setExiste(false);
            }                
        } 
        setCargado(true);
    }

    const crearOActualizar = async() => {
        if( id.length > 0 ) {  
            //Actualizar concepto en la base de datos  
            try {
                const resp = await palabrasApi.put<Palabra>(`/palabras/${ id }`, {
                    significado: significadoForm
                });
                setPalabras([ ...palabras, resp.data ]);  
                navigation.goBack();
             
            } catch (error) {
                const err = error as AxiosError
                if (err.response) {
                    setErrorTomado(err.response.data.msg);
                }                
            }       

        } else {
            //Agregar concepto en la base de datos
            try {

                let palabraFiltrada = conceptoForm;
                while (palabraFiltrada[0] === ' '){
                    palabraFiltrada = palabraFiltrada.trimStart();
                }
                while (palabraFiltrada[palabraFiltrada.length-1] === ' '){
                    palabraFiltrada = palabraFiltrada.trimEnd();
                }                

                const resp = await palabrasApi.post<Palabra>('/palabras', {
                    concepto: palabraFiltrada[0].toUpperCase() + palabraFiltrada.toLocaleLowerCase().slice(1),
                    significado: significadoForm
                });
        
                setPalabras([ ...palabras, resp.data ]);  
                navigation.goBack();
    
            } catch (error) {
                const err = error as AxiosError
                if (err.response) {
                    setErrorTomado(err.response.data.msg);
                }
            }
            // onChange( palabraNueva._id, '_id' );
        }
    } 
    
    const eliminar = async() => {
        //Eliminar concepto físicamente de la base de datos
        try {
            const resp = await palabrasApi.delete<Palabra>(`/palabras/${ id }`);
            setPalabras([ ...palabras, resp.data ]);  
            navigation.goBack();
         
        } catch (error) {
            const err = error as AxiosError
            if (err.response) {
                setErrorTomado(err.response.data.msg);
            }                
        }   
    }

    return (
        <View style={ styles.container }>
            {
                (cargado) ? (
                    (existe) ? ( 
                        ( modoEdicion ) ? (
                            //Editar concepto
                            <View style={{ flex: 1 }}>
                                <Text style={ styles.title }>Editar concepto</Text>
                                <Espaciador orientacion={'vertical'} espaciado={20} />
        
                                <Text style={ styles.label }>Concepto:</Text>
                                <TextInput 
                                    placeholder="Concepto"
                                    style={ styles.textInput }
                                    value={ conceptoForm }
                                    editable={false}
                                    onChangeText={ ( value )=> onChange( value, 'conceptoForm' )  }
                                />
                                <Text style={ styles.label }>Significado:</Text>
                                <TextInput 
                                    placeholder="Significado"
                                    multiline={true}
                                    selectionColor="white"
                                    style={{ ...styles.textInput, height: 70, textAlignVertical: 'top' }}
                                    value={ significadoForm }
                                    onChangeText={ ( value )=> onChange( value, 'significadoForm' )  }
                                />  
                                <View style={{flex: 1}} />
                                <Button
                                    title="Cancelar"
                                    onPress={ () => setModoEdicion(false) }
                                    color="#f72a2a"
                                
                                />
                                <Espaciador orientacion={'vertical'} espaciado={10} />
                                <Button 
                                    title="Guardar"
                                    onPress={ crearOActualizar }
                                    disabled={ ( significadoForm.length ) ? false : true  }
                                    color="#5856D6"
                                />                                              
                            </View>
                        ) : (
                            //Mostrar palabra y definición normalmente
                            ( _id.length > 0 ) ? (
                                <View style={{ flex: 1 }}>
                                    <Text style={ styles.title }>{ concepto }</Text>
                                    <Espaciador orientacion={'vertical'} espaciado={50} />
                                    <Text style={styles.label}>{ signficadoActualizado }</Text>
                                    <View style={{flex: 1}} />
        
                                    <Button 
                                        title="Editar"
                                        onPress={ () => { setModoEdicion(true) } }
                                        color="#5856D6"
                                    />  
                                    <Espaciador orientacion={'vertical'} espaciado={10} /> 
                                    <Button 
                                        title="Eliminar"
                                        onPress={ () => {setModalBorrar(true)} }
                                        color="#f72a2a"
                                    />  


                                    <Modal
                                        animationType='fade'
                                        visible={ modalBorrar }
                                        transparent={true}

                                    >
                                        {/* Fondo */}
                                        <View style={{
                                            flex: 1,
                                            backgroundColor: 'rgba(0,0,0,0.5)', 
                                            justifyContent: 'center',
                                            alignItems: 'center'

                                        }}>
                                            {/* Contenido del modal */}
                                            <View style={{
                                                width: 300,
                                                height: 200,
                                                borderRadius: 20,
                                                backgroundColor: 'white',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 10
                                                },
                                                shadowOpacity: 0.25,
                                                elevation: 10
                                            }}>
                                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }} >Confirmación</Text>
                                                <Espaciador orientacion={'vertical'} espaciado={5} />
                                                <Text style={{ fontSize: 16, fontWeight: '300', color: 'black' }} >¿Eliminar concepto?</Text>
                                                <Espaciador orientacion={'vertical'} espaciado={20} />
                                                <View style={{flexDirection: 'row'}}>
                                                    <Button 
                                                        title="Eliminar"
                                                        onPress={ eliminar }
                                                        color="#f72a2a"
                                                    />
                                                    <Espaciador orientacion={'horizontal'} espaciado={10} />
                                                    <Button 
                                                        title="Volver"
                                                        onPress={ () => setModalBorrar(false) }
                                                        color="#5856D6"
                                                    />  
                                                </View>
                                                
                                            </View>

                                        </View>
                                    </Modal>
                                </View>
                            ) : (
                            //Agregar concepto
                            <View style={{ flex: 1 }}>
                                <Text style={ styles.title }>Agregar concepto</Text>
                                <Espaciador orientacion={'vertical'} espaciado={20} />
        
                                <Text style={ styles.label }>Concepto:</Text>
                                <TextInput 
                                    placeholder="Ingrese la palabra o concepto principal"
                                    selectionColor={'white'}
                                    style={ styles.textInput }
                                    onChangeText={ ( value )=> onChange( value, 'conceptoForm' )  }
                                />
                                <Text style={ styles.label }>Significado:</Text>
                                <TextInput 
                                    placeholder="Ingrese la definición detallada"
                                    selectionColor={'white'}
                                    multiline={true}
                                    style={{ ...styles.textInput, height: 70, textAlignVertical: 'top' }}
                                    onChangeText={ ( value )=> onChange( value, 'significadoForm' )  }
                                />  
                                {(errorTomado.length > 0) && (
                                    <View style={styles.alert}>
                                        <Text style={styles.textoAlerta}>{ errorTomado }</Text>
                                    </View>
                                )}
        
                                <View style={{flex: 1}} />
                                <Button
                                    title="Cancelar"
                                    onPress={ () => navigation.goBack() }
                                    color="#f72a2a"
                                
                                />
                                <Espaciador orientacion={'vertical'} espaciado={10} />
        
                                <Button 
                                    title="Guardar"
                                    onPress={ crearOActualizar }
                                    color="#5856D6"
                                    disabled={ ( conceptoForm.length > 0 && significadoForm.length ) ? false : true  }
                                />                                              
                            </View> 
                            )
                        ) 
                    ) : (
                        //El concepto ya no existe
                        <View style={{ flex: 1 }}>
                            <Text style={ styles.title }>
                                Este concepto ha sido eliminado recientemente
                            </Text>
                            <Espaciador orientacion={'vertical'} espaciado={20} />
                            <Text style={ styles.label }>
                                Por favor regrese y recargue la lista.
                            </Text>
                        </View>
                    )
                ) : (
                    //Cargando
                    <View style={{ flex: 1, alignItems:'center', alignContent: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#4287f5" />

                    </View>                    
                )
            }


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        marginHorizontal: 20,
        marginBottom: 80
    },
    title: {
        fontSize: 25,
        color: 'white'
    },
    label: {
        fontSize: 18,
        color: 'white'
    },
    textInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: 'rgba(255,255,255,0.5)',
        height: 45,
        marginTop: 5,
        marginBottom: 15,
        color: 'white'
    },
    alert: {
        padding: 10,
        backgroundColor: '#ffad33',
        marginBottom: 15,
        alignItems:'center', 
        alignContent: 'center', 
        justifyContent: 'center',
        borderRadius: 10
    },
    textoAlerta: {
        color: 'white',
        fontWeight: 'bold'
    }
});


