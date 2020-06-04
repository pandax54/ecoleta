import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './styles.css'
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

import api from '../../services/api';

import logo from '../../assets/logo.svg'

const CreatePoint = () => {

    // aula 03 2:10:00
    const history = useHistory()

    // para complementar o useEffect precisaremos do estado que será mudado
    const [items, setItem] = useState<Item[]>([])

    // array ou objeto: devemos manualmente informar o tipo da viariavel
    // aula 03 1:25:30
    interface Item {
        id: number,
        title: string;
        image_url: string
    }

    // aula 03 1:20:10 
    // importando dados do backend criado
    useEffect(() => {
        // /items (rota)
        // nao aceita a syntax de async await entao deve-se usar a syntax de promises
        api.get('items').then(response => {
            console.log(response)
            setItem(response.data)
            // nossos items estao dentro de data em forma de array
        })
    }, []);


    // ===================== API EXTERNA ======================================
    // importando de api externa usaremos diretamente o axios
    // aula 03 1:30:00
    // porque o api pegará como baseUrl o que foi configurado nela, nesse caso o localhost:3333  
    const [ufs, setUfs] = useState<string[]>([])

    interface IBGEUFResponse {
        sigla: string;
        // aula 03 1:33:00
    }
    useEffect(() => {
        axios.get<IBGEUFResponse[]>(' https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)

            setUfs(ufInitials);
        });

    })

    // aula 03 1:37:00 começa no valor zero pois é o value inicial na tag select -> linha 131
    const [selectedUf, setSelectedUf] = useState('0');

    // será chamada toda vez que o usuario mudar o campo UF  onChange eventHandler
    // aula 03 1:39:00 ChangeEvent
    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
        console.log(event.target.value) // UF selecionada
        const uf = event.target.value;

        setSelectedUf(uf);

    }

    const [cities, setCities] = useState<string[]>([]);

    interface IBGECityResponse {
        nome: string;
        // aula 03 1:33:00
    }

    useEffect(() => {
        // carregar as cidades sempre que a uf mudar
        // aula 03 1:36:00 | 1:42:00
        if (selectedUf === '0') {
            return;
        }
        console.log('mudou', selectedUf)

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome)
            //console.log(cityNames)

            setCities(cityNames);
        });

    }, [selectedUf]);
    // selectedUf será o responsável pela mudança que ocorrerá nesse useEffect

    const [selectedCity, setSelectedCity] = useState('0');

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        console.log(event.target.value) // UF selecionada
        const city = event.target.value;

        setSelectedCity(city);

    }

    // posição inicial do usuário
    // aula 03 1:51:00
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position)
            const { latitude, longitude } = position.coords

            setInitialPosition([latitude, longitude]) // colocar no props center no <Map>
        });
    }, []);

    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])

    function handleMapClick(event: LeafletMouseEvent) {
        console.log(event.latlng) // LatLng {lat: -20.291163275936505, lng: -40.29188850894571}
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    // salvar os valores dos inputs
    // aula 03 1:55:00
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });
    // coloque em cada input onChange={handleInputChange}
    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        console.log(event.target, event.target.value)
        const { name, value } = event.target
        console.log(name, value)
        // substituir apenas o campo que for mudado, para isso usaremos um spread operator: aula 03 1:57:00
        // colocar o que irá mudar após o spread operator para nao sobreescrever as informações 
        setFormData({ ...formData, [name]: value })
    }


    const [selectedItems, setSelectedItems] = useState<number[]>([])

    // selecionar os tipos de items
    // aula 03 1:58:00
    function handleSelectItem(id: number) {
        console.log(id)
        const alreadyselected = selectedItems.findIndex(item => item === id) // verifica o index do intem selecionado, caso seja falso retorna -1
        console.log("already selected", alreadyselected)
        if (alreadyselected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id) // filtra do array o item selecionado outra vez - toggle mode
            setSelectedItems([...filteredItems])
            //setSelectedItems(filteredItems)
        } else {
            setSelectedItems([...selectedItems, id]) // acrescentar pois o item ainda nao foi incluido no array

        }
    }

    // enviar as informacoes para o nosso API
    // colocar no form o onSubmit
    async function handleSumbit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }
        console.log(data)
        // agora iremos enviar os dados para persistir no banco de dados na API
        try {
            await api.post('points', data)
            alert("Ponto de Coleta criado!")
            history.push('/')
        } catch (ex) {
            console.warn("Ocorreu um erro no cadastro", ex)
        }
    }

    //============================================================================

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    < FiArrowLeft />
                    Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSumbit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">E-mail </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />
                        <Marker position={selectedPosition}></Marker>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select value={selectedUf} onChange={handleSelectedUf} name="uf" id="uf">
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">City</label>
                            <select onChange={handleSelectedCity} value={selectedCity} name="city" id="city">
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens de coleta</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li
                                key={item.id}
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? "selected" : ""}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>

        </div>
    )
}

export default CreatePoint;