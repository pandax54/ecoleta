import React, { useEffect, useState } from 'react';
import { Feather as Icon } from "@expo/vector-icons";
// KeyboardAvoidingView aula 04 2:05:00
import { View, ImageBackground, Text, Image, StyleSheet } from 'react-native';
// can use source={require('../../assets/logo.png')}
//import logo from '../../assets/logo.png';
//import homeBackground from '../../assets/home-background.png';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import api from '../../services/api'
import axios from 'axios';

// TextInput aula 04 2:04:00

// https://github.com/ViniciusCrisol/Ecoleta/blob/master/booster/mobile/src/pages/Home/index.tsx
interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const Home = () => {

    // aula 04 54:00
    const navigation = useNavigation();

    const placeholderUf = {
        label: 'Selecione a UF',
        value: null,
    };

    const placeholderCity = {
        label: 'Selecione a cidade',
        value: null,
    };

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');




    useEffect(() => {
        axios
            .get<IBGEUFResponse[]>(
                'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
            )
            .then((response) => {
                const ufInitials = response.data.map((uf) => uf.sigla);

                setUfs(ufInitials);
            });
    }, []);

    useEffect(() => {
        if (selectedUf === '0') return;

        axios
            .get<IBGECityResponse[]>(
                `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
            )
            .then((response) => {
                const cityNames = response.data.map((city) => city.nome);

                setCities(cityNames);
            });
    }, [selectedUf]);

    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            uf: selectedUf,
            city: selectedCity,
        });
    }
    return (
        <ImageBackground
            source={require('../../assets/home-background.png')}
            imageStyle={{ width: 274, height: 268 }}
            style={styles.container}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>
                    Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.select}>
                    <RNPickerSelect
                        onValueChange={(value) => setSelectedUf(value)}
                        value={selectedUf}
                        placeholder={placeholderUf}
                        items={ufs.map((uf) => ({
                            label: uf,
                            value: uf,
                        }))}
                    />
                </View>

                <View style={styles.select}>
                    <RNPickerSelect
                        onValueChange={(value) => setSelectedCity(value)}
                        placeholder={placeholderCity}
                        value={selectedCity}
                        items={cities.map((city) => ({
                            label: city,
                            value: city,
                        }))}
                    />
                </View>

                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name='arrow-right' color='white' size={24} />
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>Entrar</Text>
                </RectButton>
            </View>
        </ImageBackground>

    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {
        display: 'flex',
        justifyContent: 'center',
    },

    selectors: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },

    select: {
        width: '100%',
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 8,
        borderTopLeftRadius: 8,
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },
});


export default Home;