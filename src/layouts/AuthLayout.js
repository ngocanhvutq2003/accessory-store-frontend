import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const AuthLayout = () => {
    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to right, #4e54c8, #8f94fb)' }}>
            <Content
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '420px',
                        backgroundColor: '#ffffff',
                        padding: '40px 30px',
                        borderRadius: '16px',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
};

export default AuthLayout;
