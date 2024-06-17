import { Button, Col, Flex, Form, Input, InputNumber, InputNumberProps, Row, Slider, Upload, UploadFile, UploadProps, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form"
import { FormItem } from "react-hook-form-antd";
import { zodResolver } from "@hookform/resolvers/zod";
import zod from 'zod';
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addFilm } from "../store/slice/filmSlice";
import { VideoCardType } from "../components/video-card";

interface FormCreateType {
	header: string,
	description: string,
	director: string,
	year: number | null | '',
	image: FileList | null | string | Blob | RcFile,
	video: FileList | null,
}

const RESOLVER_TEXT = (num: number, option: 'min' | 'max') => `Поле должно содержать ${option == 'min' ? 'минимум' : 'максимум'} ${num} символов`
const RESOLVER_YEAR = (num: number, option: 'min' | 'max') => `Год производства может быть ${option == 'min' ? 'минимум' : 'максимум'} ${num}`
// const REQUIRED_FILE = 'Поле не содержит явного файла'

const SchemaResolver = zod.object({
	header: zod.string().min(5, RESOLVER_TEXT(5, 'min')).max(64, RESOLVER_TEXT(64, 'max')),
	director: zod.string().min(5, RESOLVER_TEXT(5, 'min')).max(32, RESOLVER_TEXT(32, 'max')),
	year: zod.number({ message: 'Введите числовое значение' }).min(2000, RESOLVER_YEAR(2000, 'min')).max(2030, RESOLVER_YEAR(2030, 'max')),
	description: zod.string().min(5, RESOLVER_TEXT(5, 'min')).max(256, RESOLVER_TEXT(256, 'max')),
})

const CreateVideo: React.FC = () => {
	
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [imageCover, setImageCover] = useState<UploadFile[]>([]);

	const defaultValues = {
		header: '',
		description: '',
		image: null,
		video: null,
		director: '',
		year: 2024
	};

	const navigate = useNavigate();

	const { handleSubmit, setError, control, getValues, reset, setFocus, formState: { errors, isSubmitSuccessful, isLoading } } = useForm<FormCreateType>({
		defaultValues,
		mode: 'onChange',
		resolver: zodResolver(SchemaResolver)
	});

	const dispatch = useDispatch();
	const onValidSubmit: SubmitHandler<FormCreateType> = async(data) => {
		if(fileList[0].status !== 'done') {
			return setError('video', { type: 'validate', message: 'Видео не было загружено на сервер, загрузите другое' })
		}

		await axios.post('http://localhost:3000/api/films/addFilm', {
			...data,
			image: imageCover[0].response,
			video: fileList[0].response.path
		}, { headers: {
			'Content-Type': 'multipart/form-data'
		} }).then(async ({ data: res_data }: { data: VideoCardType }) => {
			dispatch<any>(addFilm(res_data));
			navigate('/');
		});
	}
	
	useEffect(() => {
		if(isSubmitSuccessful && !isLoading) {
			setFileList([]);
			setImageCover([]);
			reset(defaultValues);
		}

		if(errors.video?.type === 'validate') {
			setFocus('video');
		}
	}, [isSubmitSuccessful, isLoading, reset, setFileList, setImageCover, setFocus]);

	const [inputValue, setInputValue] = useState(Number(getValues('year')));

	const onChangeYear: InputNumberProps['onChange'] = (newValue) => setInputValue(Number(newValue)) 

	const onChangeUploadVideo: UploadProps['onChange'] = (info) => {
		setFileList(info.fileList);

		switch(info.file.status) {
			case 'uploading': {
				message.loading('Началась загрузка видео...')
				break;
			} case 'done': {
				message.success(`Видео было успешно загружено на сервер`);
				break;
			} case 'error': {
				message.error(`Произошла ошибка. Видео не было загружено на сервер`)
				break;
			}
		}
	}

	return (
	<>
		<Flex className="w-full h-screen flex items-center justify-center" vertical={true}>
			<Form action="#" className="w-[400px] flex flex-col flex-wrap p-5 rounded-xl" style={{border:'1.5px solid #00000015'}} layout="vertical" method="POST" encType="multipart/form-data" onFinish={handleSubmit(onValidSubmit)} colon={false} variant="filled">
				<Flex gap={15} className="w-full">
					<FormItem className="w-1/2" control={control} name="header" label="Название фильма">
						<Input placeholder="Укажите название фильма" />
					</FormItem>
					<FormItem className="w-1/2" control={control} name="director" label="Режиссер фильма">
						<Input placeholder="Укажите режиссера фильма" />
					</FormItem>
				</Flex>
				<FormItem control={control} name="description" label="Описание фильма">
					<Input.TextArea showCount placeholder="Начните описывать какой замечательный фильм..." rows={4} maxLength={256} autoSize={{minRows: 4, maxRows: 10}} />
				</FormItem>

				<FormItem control={control} name="year" label="Год производства">
					<Row justify={'space-between'}>
						<Col span={17}>
							<Slider min={2000} max={2030} value={Number(inputValue)} onChange={onChangeYear}/>
						</Col>
						<Col span={6}>
							<InputNumber min={2000} max={2030} value={Number(inputValue)} onChange={onChangeYear}/>
						</Col>
					</Row>
				</FormItem>

				<FormItem control={control} name="image" label="Обложка фильма">
					<Upload accept="image/png"
						maxCount={1}
						listType={'picture'}
						fileList={imageCover}
						onChange={(info) => {
							setImageCover(info.fileList);
						}}
						customRequest={async (data) => {
							if(data.onSuccess) {
								data.onSuccess(data.file);
								message.info('Изображение начнет загрузку после отправки формы')
							}
							return false;
						}}
					>
						<Button icon={<UploadOutlined />}>Загрузить обложку</Button>
					</Upload>
				</FormItem>

				<FormItem control={control} name="video" label="Видео с фильмом">
					<Upload
						accept="video/mp4"
						action={'http://localhost:3000/api/films/uploadVideo'}
						onChange={onChangeUploadVideo} 
						maxCount={1}
						fileList={fileList}
						customRequest={async (file) => {
							return await axios.post(file.action, { video: file.file }, { headers: { 'Content-Type': 'multipart/form-data' } }).then(async (res: any) => {
								if(file.onSuccess !== undefined) {
									file.onSuccess(res.data);
								}
								return res.data;
							}).catch(async (err: Error) => {
								if(file.onError) {
									file.onError(err);
								}
								return err.message;
							})
						}}
					>
						<Button icon={<UploadOutlined />}>Загрузить видео</Button>
					</Upload>
				</FormItem>

				<Form.Item>
					<Button size="large" block type="primary" htmlType="submit" disabled={
						(fileList[0] && fileList[0].status === 'uploading' ? true : false) ||
						isLoading
					}>Создать фильм</Button>
				</Form.Item>
			</Form>
		</Flex>
	</>
  )
}

export default CreateVideo
