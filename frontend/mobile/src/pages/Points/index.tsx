import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
// aula 04 1:48:40 -> useRoute, route.params
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import api from '../../services/api'
import * as Location from 'expo-location'
import Routes from '../../routes';

// aula 04 2:10:00
interface Params {
    uf: string,
    city: string
}

const Points = () => {

    // aula 04 1:26:00 -> criando a interface do objeto e buscando os items na API
    interface Item {
        id: number,
        title: string,
        image_url: string
    }

    const [items, setItems] = useState<Item[]>([]);
    // aula 04 1:24:00 --> conectar o mobile com o API (useState e useEffect) + axios install + services folder (api.ts)
    useEffect(() => {
        api.get('items').then(response => {
            console.log(response)
            setItems(response.data)
        })
    }, [])

    const [selectedItems, setSelectedItems] = useState<number[]>([])
    useEffect(() => {

    }, [])

    function handleSelectedItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id)

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        } else {
            setSelectedItems([...selectedItems, id])
        }
    }

    // ======== LOCALIZAÇÃO NO MAPA =============
    // aula 04 1:34:00
    const [initalPosition, setInitialPosition] = useState<[number, number]>([0, 0])

    useEffect(() => {
        async function loadPosition() {
            const { status } = await Location.requestPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('OOOooops... Precisamos da sua permissão para obter a sua localização')
                return;
            }
            const location = await Location.getCurrentPositionAsync();

            const { latitude, longitude } = location.coords;
            console.log(latitude, longitude)

            setInitialPosition([
                latitude,
                longitude
            ])
        }

        loadPosition()
    }, [])

    interface Point {
        id: number,
        name: string,
        image: string,
        image_url: string,
        latitude: number,
        longitude: number,

    }

    const route = useRoute()
    // aula 04 1:50:40  
    const routeParams = route.params as Params;


    const [points, setPoints] = useState<Point[]>([])
    // aula 04 1:43:00 | 1:45:42 | 2:11:00
    // <Marker>
    useEffect(() => {
        api.get('points', {
            params: {
                city: routeParams.city,
                uf: routeParams.uf,
                items: selectedItems
            }
        }).then(response => {
            setPoints(response.data)
        })
    }, [selectedItems])

    //=====================================================

    const navigation = useNavigation();

    function handleNavigateBack() {
        //navigation.navigate('Home')
        navigation.goBack();
    }

    function handleNavigateToDetail(id: number) {
        navigation.navigate('Details', { point_id: id })
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Text style={styles.title}>Bem Vindo</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta</Text>
                <View style={styles.mapContainer}>
                    {/* // aula 04 1:40:00 - para o mapa functinar pois ele nao funciona quando a posicao é zero*/}
                    {initalPosition[0] !== 0 && (
                        <MapView
                            style={styles.map}
                            loadingEnabled={initalPosition[0] === 0}
                            initialRegion={{
                                latitude: initalPosition[0],
                                longitude: initalPosition[1],
                                latitudeDelta: 0.014,
                                longitudeDelta: 0.014
                            }}
                        >
                            {points.map(point => (

                                <Marker
                                    key={String(point.id)}
                                    onPress={() => { handleNavigateToDetail(point.id) }}
                                    style={styles.mapMarker}
                                    coordinate={{
                                        latitude: point.latitude,
                                        longitude: point.longitude,
                                    }}
                                >
                                    <View style={styles.mapMarkerContainer}>
                                        <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
                                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    )}
                </View>
            </View>


            <View style={styles.itemsContainer}>
                <ScrollView horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {
                        items.map(item => (

                            <TouchableOpacity
                                key={String(item.id)}
                                style={[
                                    styles.item,
                                    selectedItems.includes(item.id) ? styles.selectedItem : {}
                                ]}
                                activeOpacity={0.5}
                                onPress={() => { handleSelectedItem(item.id) }}

                            >
                                {/* aula 04 1:05:00 */}
                                <SvgUri width={42} height={42} uri={item.image_url} />
                                <Text style={styles.itemTitle}>{item.title}</Text>
                            </TouchableOpacity>

                        ))
                    }

                </ScrollView>
            </View>

        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    title: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 4,
        fontFamily: 'Roboto_400Regular',
    },

    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
    },

    map: {
        width: '100%',
        height: '100%',
    },

    mapMarker: {
        width: 90,
        height: 80,
    },

    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: '#34CB79',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },

    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },

    itemsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 32,
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',

        textAlign: 'center',
    },

    selectedItem: {
        borderColor: '#34CB79',
        borderWidth: 2,
    },

    itemTitle: {
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },
});

export default Points;
