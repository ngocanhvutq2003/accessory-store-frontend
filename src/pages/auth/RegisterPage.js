import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Logo web phụ kiện

const { Title, Text } = Typography;

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, values);
            if (res.data.success) {
                message.success('Đăng ký thành công!');
                navigate('/auth/login');
            } else {
                message.error(res.data.message || 'Đăng ký thất bại!');
            }
        } catch (error) {
            console.error(error);
            message.error('Đăng ký thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <img src={logo} alt="Logo" style={{ height: 50, marginBottom: 12 }} />
                <Title level={3}>Đăng ký</Title>
                <Text type="secondary">Tạo tài khoản để trải nghiệm mua sắm phụ kiện thời trang dễ dàng</Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                size="large"
            >
                <Form.Item
                    label="Họ"
                    name="lastname"
                    rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                >
                    <Input placeholder="Nhập họ" />
                </Form.Item>

                <Form.Item
                    label="Tên"
                    name="firstname"
                    rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                >
                    <Input placeholder="Nhập tên" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                >
                    <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu"
                    name="password_confirmation"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Vui lòng nhập lại mật khẩu' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Nhập lại mật khẩu" />
                </Form.Item>

                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        block 
                        loading={loading}
                        style={{ 
                            backgroundColor: '#722ED1', 
                            borderColor: '#722ED1', 
                            height: 45, 
                            fontSize: 16 
                        }}
                    >
                        Đăng ký
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Text>Bạn đã có tài khoản? </Text>
                    <Link to="/auth/login" style={{ color: '#722ED1' }}>Đăng nhập ngay</Link>
                </div>
            </Form>
        </div>
    );
};

export default RegisterPage;
