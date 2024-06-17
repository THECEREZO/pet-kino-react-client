import React from 'react';

type Props = {
    src: string;
    poster: string;
    isPlaying: any;
};

const VideoPlayer: React.FC<Props> = ({ src, poster, isPlaying }) => {
    return (
        <div className='h-[250px]'>
            {isPlaying ? (
                <video
                    className='w-[100%] h-[100%]'
                    style={{ objectFit: 'cover' }}
                    poster={poster}
                    autoPlay
                    muted
                >
                    <source src={src} />
                </video>
            ) : (
                <img src={poster} className='w-[100%] h-[100%]' style={{objectFit:'cover'}}/>
            )}
        </div>
    );
};

export default VideoPlayer;
