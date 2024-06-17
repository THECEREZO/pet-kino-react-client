import { Card } from 'antd';
import React, { memo, useState } from 'react';
import VideoPlayer from '../video-player';
import { SERVER } from '../../constants';
import { Link } from 'react-router-dom';

export type VideoCardType = {
	['_id']?: string;
    img: string;
	video: string;
    header: string;
    description: string;
	director: string;
	year: number;
};

export const VideoCardDefault = {
	_id: Math.abs(Date.now()).toString(),
	img: '',
	video: '',
	header: 'Неизвестно',
	description: 'Неизвестно',
	director: 'Неизвестно',
	year: 0
	
}


const VideoCard: React.FC<VideoCardType & { link: string }> = memo(({ video, img, description, header, link }) => {
	const [isPlay, setIsPlay] = useState<boolean>(false);
	
	console.log(SERVER + 'static/' + video);
	console.log(SERVER + 'static/' + img);

    return (
        <Link to={link}>
            <Card
                id={Math.random().toString()}
                hoverable
                className='w-[200px]'
				onMouseOver={() => { setIsPlay(true); }}
				onMouseOut={() => { setIsPlay(false); }}
                cover={<VideoPlayer isPlaying={isPlay} src={SERVER + 'static/' + video} poster={SERVER + 'static/' + img}/>}
            >
                <Card.Meta title={header} description={description} />
            </Card>
        </Link>
    );
});

export default VideoCard;
