import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi'

import './styles.css';

interface Props {
    onFileUploaded: (file: File) => void;
}

// React.FC<Props> React function component que recebe props
const Dropzone: React.FC<Props> = (props) => {

    const onFileUploaded = props.onFileUploaded

    const [selectedFileUrl, setSelectedFileUrl] = useState('')

    // aula 05 36:30 
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        const file = acceptedFiles[0] // somente terá um arquivo entao ele sempre estará na posição zero

        // aula 05 31:30 -> URL variável global do js para criar uma url com a imagem
        const fileUrl = URL.createObjectURL(file)

        setSelectedFileUrl(fileUrl)
        onFileUploaded(file)

        console.log(file)

    }, [onFileUploaded])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*'
    })

    return (
        <div className="dropzone" {...getRootProps()}>
            {/* para receber vários aquivos basta colocar a propriedade multiple no input abaixo */}
            <input {...getInputProps()} accept='image/*' />

            {
                selectedFileUrl
                    // conseguimos vizualizar a imagem mas agora precisaremos persistir essa imagem no banco de dados
                    // aula 05 33:00
                    ? <img src={selectedFileUrl} alt="Point Thumbnail" />
                    : (
                        isDragActive ?
                            <p>Solte a imagem ...</p> :
                            <p> <FiUpload /> Arraste aqui a imagem do estabelecimento</p>
                    )
            }

        </div>
    )
}



export default Dropzone;