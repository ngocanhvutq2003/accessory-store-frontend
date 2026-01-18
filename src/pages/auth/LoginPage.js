import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import logo from '../../assets/logo.png';

const { Title, Text } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();


    useEffect(() => {
        const savedLogin = localStorage.getItem('rememberedLogin');
        if (savedLogin) {
            const parsed = JSON.parse(savedLogin);
            form.setFieldsValue({
                email: parsed.email,
                password: parsed.password,
                remember: true
            });
        }
    }, [form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { email, password } = values;

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/login`,
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            const { success, message: msg, token, user } = response.data;

            if (!success) {
                toast.error(msg || 'Đăng nhập thất bại!');
                return;
            }

            toast.success(msg || 'Đăng nhập thành công!');
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            if (values.remember) {
                localStorage.setItem('rememberedLogin', JSON.stringify({ email, password }));
            } else {
                localStorage.removeItem('rememberedLogin');
            }

            setTimeout(() => {
                if (user.role?.code?.toLowerCase() === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }, 1000);

        } catch (error) {
            const errMsg = error?.response?.data?.message || 'Đăng nhập thất bại!';
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {/* Hot Toast container */}
            <Toaster position="top-center" reverseOrder={false} />

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <img src={logo} alt="Logo" style={{ height: 50, marginBottom: 12 }} />
                <Title level={3}>Đăng nhập</Title>
                <Text type="secondary">Đăng nhập để trải nghiệm mua sắm phụ kiện dễ dàng</Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                size="large"
            >
                <Form.Item
                    label="Email hoặc tên đăng nhập"
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập email hoặc tên đăng nhập' }]}
                >
                    <Input placeholder="Nhập email hoặc tên đăng nhập" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Nhớ mật khẩu</Checkbox>
                    </Form.Item>
                    <Link to="/" style={{ color: '#722ED1' }}>Quên mật khẩu?</Link>
                </div>

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
                        Đăng nhập
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Text>Bạn chưa có tài khoản? </Text>
                    <Link to="/auth/register" style={{ color: '#722ED1' }}>Đăng ký ngay</Link>
                </div>
            </Form>
        </div>
    );
};

export default LoginPage;
