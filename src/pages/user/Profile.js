/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message, Card, Typography, Avatar, Row, Col, Divider, Space, Tag } from 'antd';
import { UploadOutlined, UserOutlined, EditOutlined, SaveOutlined, CloseOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import normalizeFileName from '../../utils/normalizeFileName';

const { Title, Text } = Typography;

const Profile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [userData, setUserData] = useState({});
    const [file, setFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            message.warning('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');
            navigate('/auth/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (storedUser && storedUser.id && !userData.id) {
            form.setFieldsValue({
                firstname: storedUser.firstname,
                lastname: storedUser.lastname,
                email: storedUser.email,
                phone: storedUser.phone,
            });
            setUserData(storedUser);
        }
    }, [form, userData, storedUser]);

    const handleUploadChange = ({ fileList }) => {
        const rawFile = fileList?.[0]?.originFileObj;
        if (!rawFile) return;

        const newFileName = normalizeFileName(rawFile.name);
        const renamedFile = new File([rawFile], newFileName, { type: rawFile.type });

        setFile(renamedFile);
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result);
        reader.readAsDataURL(renamedFile);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (key === 'password' && !values[key]) return;
            formData.append(key, values[key]);
        });
        if (file) formData.append('image', file);

        try {
            const res = await axios.put(`${API_URL}/users/${storedUser.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            message.success('Cập nhật thông tin thành công!');
            const updatedUser = { ...res.data.data, role: storedUser.role };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUserData(updatedUser);
            setPreviewImage(null);
            setFile(null);
            setIsEditing(false);
            window.dispatchEvent(new Event('userUpdated'));
        } catch (error) {
            message.error(error?.response?.data?.message || 'Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: 'linear-gradient(180deg, #fff0f3 0%, #fff 100%)', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <Card 
                    bordered={false} 
                    style={{ borderRadius: 30, boxShadow: '0 20px 50px rgba(255, 133, 162, 0.1)' }}
                >
                    <Row gutter={[40, 40]}>
                        {/* Cột trái: Avatar và tên */}
                        <Col xs={24} md={8} style={{ textAlign: 'center', borderRight: '1px solid #f0f0f0' }}>
                            <div style={{ position: 'relative', display: 'inline-block', padding: 10, background: '#fff', borderRadius: '50%', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                                <Avatar
                                    size={160}
                                    ssrc={previewImage || (userData.image ? `${userData.image}` : null)}
                                    icon={<UserOutlined />}
                                    style={{ border: '4px solid #fff' }}
                                />
                                {isEditing && (
                                    <Upload
                                        showUploadList={false}
                                        beforeUpload={() => false}
                                        onChange={handleUploadChange}
                                        accept="image/*"
                                    >
                                        <Button 
                                            shape="circle" 
                                            icon={<UploadOutlined />} 
                                            style={{ 
                                                position: 'absolute', bottom: 10, right: 10, 
                                                background: '#ff85a2', color: '#fff', border: 'none' 
                                            }} 
                                        />
                                    </Upload>
                                )}
                            </div>
                            <div style={{ marginTop: 20 }}>
                                <Title level={3} style={{ marginBottom: 0 }}>{userData.lastname} {userData.firstname}</Title>
                                <Tag color="pink" style={{ marginTop: 8, borderRadius: 10 }}>Thành viên thân thiết</Tag>
                            </div>

                            <Divider style={{ margin: '24px 0' }} />
                            
                            <Space direction="vertical" style={{ width: '100%', textAlign: 'left' }} size="middle">
                                <Text type="secondary"><MailOutlined /> {userData.email}</Text>
                                <Text type="secondary"><PhoneOutlined /> {userData.phone || 'Chưa cập nhật'}</Text>
                            </Space>
                        </Col>

                        {/* Cột phải: Form chỉnh sửa */}
                        <Col xs={24} md={16}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                                <Title level={4} style={{ margin: 0 }}>Cài đặt tài khoản</Title>
                                {!isEditing && (
                                    <Button 
                                        type="primary" 
                                        icon={<EditOutlined />} 
                                        onClick={() => setIsEditing(true)}
                                        style={{ borderRadius: 15, background: '#ff85a2', border: 'none' }}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                )}
                            </div>

                            <Form form={form} layout="vertical" onFinish={onFinish} disabled={!isEditing}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Họ" name="lastname" rules={[{ required: true, message: 'Nhập họ' }]}>
                                            <Input placeholder="Họ của bạn" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Tên" name="firstname" rules={[{ required: true, message: 'Nhập tên' }]}>
                                            <Input placeholder="Tên của bạn" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item label="Email" name="email">
                                    <Input disabled />
                                </Form.Item>

                                <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Nhập SĐT' }]}>
                                    <Input placeholder="Số điện thoại liên hệ" />
                                </Form.Item>

                                {isEditing && (
                                    <>
                                        <Divider />
                                        <Form.Item 
                                            label="Thay đổi mật khẩu" 
                                            name="password"
                                            extra={<Text type="secondary" style={{ fontSize: 12 }}>Bỏ trống nếu không muốn đổi mật khẩu</Text>}
                                        >
                                            <Input.Password placeholder="Nhập mật khẩu mới" />
                                        </Form.Item>

                                        <div style={{ textAlign: 'right', marginTop: 30 }}>
                                            <Space>
                                                <Button 
                                                    icon={<CloseOutlined />} 
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        form.resetFields();
                                                        setPreviewImage(null);
                                                    }}
                                                    style={{ borderRadius: 15 }}
                                                >
                                                    Hủy
                                                </Button>
                                                <Button 
                                                    type="primary" 
                                                    htmlType="submit" 
                                                    loading={loading}
                                                    icon={<SaveOutlined />}
                                                    style={{ borderRadius: 15, background: '#ff85a2', border: 'none' }}
                                                >
                                                    Lưu thay đổi
                                                </Button>
                                            </Space>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </Col>
                    </Row>
                </Card>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .ant-input, .ant-input-password {
                    border-radius: 10px !important;
                    padding: 8px 12px;
                }
                .ant-form-item-label label {
                    font-weight: 500 !important;
                    color: #555 !important;
                }
                .ant-card {
                    animation: fadeInUp 0.6s ease-out;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
};

export default Profile;