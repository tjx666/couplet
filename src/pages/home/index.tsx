import { useCallback, useState } from 'react';

import Photograph from '../../components/photograph';

import './index.scss';

export default function Home() {
    const [takeingPhoto, setTakingPhoto] = useState(false);

    const takePhoto = useCallback(() => {
        setTakingPhoto(true);
    }, []);

    const handlePhoto = useCallback((dataUrl: string) => {
        setTakingPhoto(false);
        console.log(dataUrl);
    }, []);

    return (
        <main className="home">
            <button className="take-photo" onClick={takePhoto}>
                <span className="take-photo__top">拍照</span>
                <br />
                <span className="take-photo__bottom">识别</span>
            </button>
            {takeingPhoto ? <Photograph onTake={handlePhoto} /> : null}
        </main>
    );
}
