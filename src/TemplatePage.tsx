import React from 'react';
import { Layout, Flex, Image, Typography, Menu } from 'antd';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';
import {
    HomeFilled,
    YoutubeFilled,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

// const navigate = useNavigate();

export const TemplateProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const navigationMenu: MenuItemType[] = [
        { key: 0, label: <Link to='/'>Главная</Link>, icon: <HomeFilled /> },
        { key: 1, label: <Link to='/create'>Создать</Link>, icon: <YoutubeFilled /> },
    ];

    return (
        <Layout className='w-screen h-full'>
            <Layout.Header className='flex items-center gap-1 justify-between'>
                <Link to={'/'}>
                    <Flex align='center' gap={3} className='w-[120px] flex items-center justify-center'>
                        <Image
                            src='../logo.png'
                            preview={false}
                            className='flex items-center'
                            width={32}
                            height={32}
                        />
                        <Typography.Text
                            className='font-bold h-[32px] flex text-nowrap items-center'
                            style={{ color: '#ffffff' }}
                        >
                            {'Kinodev'.toUpperCase()}
                        </Typography.Text>
                    </Flex>
                </Link>

                <Menu
                    inlineIndent={12}
                    className='w-full flex items-center justify-end'
                    theme='dark'
                    mode='horizontal'
                    defaultSelectedKeys={['0']}
                    items={navigationMenu}
                />
            </Layout.Header>

            {children}
        </Layout>
    );
};
