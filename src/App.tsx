import { Col, Flex, Layout, Row, Typography } from 'antd';
import VideoCard, { VideoCardType } from './components/video-card';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilmsByAll, selectAllFilms } from './store/slice/filmSlice';
import { RootState } from './store/store';
import SpinnerLoad from './components/spinner';

const App: React.FC = () => {
    const [filmList, setFilmList] = useState<Array<VideoCardType>>([]);

    const dispatch = useDispatch();
    const info: Array<VideoCardType> = useSelector(selectAllFilms);
    const status = useSelector((state: RootState) => state.films.status);

    useEffect(() => {
        if (status === 'initial') {
            const getData = async () => {
                dispatch<any>(fetchFilmsByAll());
            };
            getData();
        } else if (status === 'fulfilled') {
            // setTimeout(async () => {
            setFilmList(info);
            // }, 500); // визуал задержка т.к запросы с апишки приходят быстро по локальному соединению
        }
    }, [status]);

	const filmsRender = filmList.map((item, index) => {
		return (
			<Col key={`videocard__${index}`}>
				<VideoCard
					{...item}
					link={`/videoplayer/${item['_id']}`}
				/>
			</Col>
		);
	})

    return (
        <Flex className='h-screen'>
            <Layout.Content className='px-[120px] py-[65px] h-full'>
                <Row
                    gutter={[16, 16]}
                    align={!filmList[0] ? 'middle' : 'top'}
                    justify={!filmList[0] ? 'center' : 'start'}
                    className='h-full'
                >
                    {status == 'fulfilled' ? filmsRender : 
						status == 'empty_content' ? <Typography.Title level={3}>Видео не найдены</Typography.Title> : <SpinnerLoad /> }
                </Row>
            </Layout.Content>
        </Flex>
    );
};

export default App;
