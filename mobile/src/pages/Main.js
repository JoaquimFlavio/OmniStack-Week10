import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons'

import api from '../services/api';
import {connect, disconnect, subscribeToNewDevs} from '../services/socket';

function Main({ navigation }){
    //Criação dos estados que serão utilizados na Aplicação,
    const [devs, setDevs] = useState([]);
    const [techs, setTechs] = useState('');
    const [currentRegion, setCurrentRegion] = useState(null);
    
    useEffect(() => {
        async function loadInitialPosition(){
            //Solicita autorização do usuario para utilizar o GPS.
            const { granted } = await requestPermissionsAsync();

            if(granted){
                //Obtem as coordenadas do GPS.
                const {coords} = await getCurrentPositionAsync({
                    enableHighAccuracy: true,//Modo de auta precisão
                });

                const { latitude, longitude } = coords;
                
                //Atualiza o estado da regiao.
                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                })
            }
        }

        loadInitialPosition();
    }, []);//Realizada apenas uma unica vez.

    useEffect(() => {
        /*
         * Envia a função responsavel por atualizar o estados dos devs,
         * de modo que sempre que o servidor enviar uma mensagem o estado
         * será atualizado, recebendo o novo usuario, e então essa função 
         * voltará a ser chamada.
         */ 
        subscribeToNewDevs(dev => setDevs([...devs, dev]));
    }, [devs]);//Realiza sempre que devs for alterado.

    function setupWebsocket(){
        //Encerra possiveis conexões anteriores
        disconnect();

        const {latitude, longitude} = currentRegion;

        //Se conecta ao servidor e então envia sua localização e tecnologias desejadas.
        connect(
            latitude,
            longitude,
            techs,
        );
    }

    async function loadDevs() {
        const { latitude, longitude } = currentRegion;

        /*
         * Realiza uma primeira chamada a API para obter todos os devs num raio de 10km
         * que utilizem as tecnologias desejadas.abs
         * Depois os novos Devs serão adicionados em tempo real atraves do WebSockets.
         */
        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        });

        setDevs(response.data.devs);//Atualiza o estado dos Devs.
        setupWebsocket();//Inicia a conexão WebSockets.
    }

    function handleRegionChange(region){
        setCurrentRegion(region);//Atualiza o estado das regioes.
    }

    if(!currentRegion){
        //Enquanto o GPS nao retorna os dados entregamos null à pagina.
        return null;
    }

    return (
        <>
            <MapView onRegionChangeComplete={handleRegionChange} initialRegion={currentRegion} style={styles.map}>
                {devs.map(dev => (
                    <Marker
                        key={dev._id}  
                        coordinate={{
                            longitude: dev.location.coordinates[0],
                            latitude: dev.location.coordinates[1], 
                        }}
                    >
                        <Image 
                            style={styles.avatar} 
                            source={{ uri: dev.avatar_url }} 
                        />

                        <Callout onPress={() => {
                            navigation.navigate('Profile', { github_username: dev.github_username});
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            <View style={styles.searchForm}>
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Buscar devs por techs..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorret={false}
                    value={techs}
                    onChangeText={text => setTechs(text)}
                />

                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                    <MaterialIcons name="my-location" size={20} color="#FFF" />
                </TouchableOpacity>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFF'
    },

    callout: {
        width: 250,
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    devBio: {
        color: '#666',
        marginTop: 5,
    },
    devTechs: {
        marginTop: 5,
    },

    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8E4Dff',
        borderRadius: 25, 
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    }

})

export default Main;