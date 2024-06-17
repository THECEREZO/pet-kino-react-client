import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const SpinnerLoad = () => {
    return (
        <Spin tip='Loading' size='large' indicator={<LoadingOutlined />}>
            <div
                className='p-[60px] rounded-2xl'
                style={{ background: '#FF000065' }}
            />
        </Spin>
    );
};

export default SpinnerLoad;
