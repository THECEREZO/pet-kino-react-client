import { useNavigate, useParams } from 'react-router-dom';
import { Button, Descriptions, DescriptionsProps, Flex, Layout, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { fetchFilmsByAll, selectFilmById } from './store/slice/filmSlice';
import { useEffect, useState } from 'react';
import { VideoCardType } from './components/video-card';
import { SERVER } from './constants';
import SpinnerLoad from './components/spinner';

const VideoPlayer: React.FC = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const status = useSelector((state: RootState) => state.films.status);
    const [videoInfo, setVideoInfo] = useState<VideoCardType>();
	const dataFulfilled = useSelector((state: RootState) => selectFilmById(state, id));

    useEffect(() => {
		if (status == 'initial' && id) {
            dispatch<any>(fetchFilmsByAll());
        } else if (status == 'fulfilled') {
            if (dataFulfilled) {
				setVideoInfo(dataFulfilled);
            }
        }
    }, [status]);

	const navigate = useNavigate();

	if(!dataFulfilled && status == 'empty_content') {
		return (
			<Layout.Content className='h-screen px-[120px] py-[65px] flex flex-col items-center justify-center'>
				<Typography.Title level={3}>Видео не найдено</Typography.Title>
				<Typography.Paragraph className='text-center'>Возможно вы ошиблись страницей, повторите попытку позже</Typography.Paragraph>
				<Button type='primary' size='middle' onClick={() => navigate('/')}>На главную</Button>
			</Layout.Content>
		)
	}

    if (!videoInfo) {
        return (
			<Layout.Content className='h-screen px-[120px] py-[65px] flex flex-col items-center justify-center'>
				<SpinnerLoad />
			</Layout.Content>
		)
    }

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Описание',
            children: videoInfo.description,
        },
        {
            key: '2',
            label: 'Режиссер',
            children: videoInfo.director,
        },
        {
            key: '3',
            label: 'Год выхода',
            children: videoInfo.year.toString(),
        },
    ];

    return (
        <Layout.Content className='h-full px-[120px] py-[65px] flex flex-col items-center justify-center'>
				<Flex gap={35} className='w-full h-[400px]'>
					<div className='w-[30%] h-[100%] rounded-2xl'>
						<img src={`${SERVER}` + 'static/' + videoInfo.img} className='w-[100%] h-[100%] rounded-2xl' style={{objectFit:'cover'}} />
					</div>

					<div className='w-[70%] h-[100%] rounded-2xl'>
						<video
							src={`${SERVER}` + 'static/' + videoInfo.video}
							controls={true}
							className={'w-[100%] h-[100%] rounded-2xl'}
							style={{objectFit:'cover'}}
						/>
					</div>
				</Flex>

            <Descriptions
                title={videoInfo.header}
                className='my-10'
                layout='vertical'
                items={items}
            />
        </Layout.Content>
    );
};

export default VideoPlayer;
