import { useMount, useUnmount } from 'ahooks';
import { useCallback, useRef, useState } from 'react';

import './index.scss';

interface PhotographProps {
    onTake?: (dataUrl: string) => void;
}

export default function Photograph({ onTake }: PhotographProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | undefined>();
    const [videoResolution, setVideoResolution] = useState({
        width: 0,
        height: 0,
    });

    useMount(async () => {
        const video = videoRef.current!;
        const canvas = canvasRef.current!;

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        });
        setStream(stream);
        video.srcObject = stream;
        video.play();

        const videoTrack = stream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();
        const width = settings.width!;
        const height = settings.height!;
        setVideoResolution({ width, height });
        canvas.width = width;
        canvas.height = height;
    });

    useUnmount(() => {
        const tracks = stream!.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });
    });

    const takePhoto = useCallback(async () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(videoRef.current!, 0, 0, videoResolution.width, videoResolution.height);
        const imageData = canvas.toDataURL('image/png');
        onTake?.(imageData);
    }, [onTake, videoResolution.height, videoResolution.width]);

    return (
        <div className="photograph">
            <canvas ref={canvasRef}></canvas>
            <video ref={videoRef}></video>
            <div className="take-photo" onClick={takePhoto}></div>
        </div>
    );
}
