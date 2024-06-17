import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import VideoPlayer from './VideoPlayer.tsx';
import { TemplateProvider } from './TemplatePage.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import CreateVideo from './pages/CreateVideo.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <ConfigProvider
        theme={{
            token: { colorPrimary: '#FF0000' },
            components: {
                Layout: {
                    headerColor: '#ffffff',
                    headerHeight: 64,
                    headerPadding: '0px 250px',
                },
            },
        }}
    >
		<BrowserRouter>		
			<TemplateProvider>
				<Provider store={store}>
					<Routes>
						<Route path='/' index element={<App />} />
						<Route path='/create' element={<CreateVideo />} />
						<Route path='/videoplayer/:id' element={<VideoPlayer />} />
					</Routes>
				</Provider>
			</TemplateProvider>
		</BrowserRouter>
    </ConfigProvider>
    // </React.StrictMode>
);
