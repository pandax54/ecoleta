import React from 'react';
import logo from '../../assets/logo.svg' // no react importamos as imagens e usamos como variáveis dentro do código
import './styles.css'; // pasta importar o arquivo
// https://www.figma.com/file/1SxgOMojOB2zYT0Mdk28lB/Ecoleta
import { Link } from 'react-router-dom';

import { FiLogIn } from 'react-icons/fi' // feather icons
// npm install react-icons -> permite utilizar conteudo do font awesome, material icons, feather icons etc

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta" />
                </header>

                <main>
                    <h1>Seu marketplace de coletas de resíduos</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</p>
                    <Link to="/create-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}


export default Home;