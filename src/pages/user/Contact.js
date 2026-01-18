import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, Card, Typography, message, Space, Tag, Divider } from 'antd';
import { 
    MailOutlined, 
    PhoneOutlined, 
    HomeOutlined, 
    SendOutlined, 
    MessageOutlined,
    CustomerServiceOutlined,
    FacebookOutlined,
    InstagramOutlined,
    YoutubeOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Contact = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/contacts`, values);
            // Giả định backend trả về success: true hoặc kiểm tra status 200/201
            if (response.status === 200 || response.data.success) {
                message.success('Thông tin của bạn đã được gửi đi thành công!');
                form.resetFields();
            } else {
                message.error(response.data.message || 'Có lỗi xảy ra khi gửi thông tin');
            }
        } catch (error) {
            console.error('Contact Error:', error);
            message.error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#fffaf9', minHeight: '100vh', padding: '60px 20px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                
                {/* Section: Header */}
                <div style={{ textAlign: 'center', marginBottom: 60 }}>
                    <Tag color="#ff85a2" style={{ borderRadius: 20, padding: '2px 16px', marginBottom: 16, border: 'none', fontWeight: 600 }}>
                        CONTACT US
                    </Tag>
                    <Title level={1} style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, margin: 0 }}>
                        Chúng tôi luôn <span style={{ color: '#ff85a2' }}>lắng nghe</span> bạn
                    </Title>
                    <Paragraph style={{ fontSize: 17, color: '#636e72', marginTop: 16, maxWidth: 600, margin: '16px auto' }}>
                        Mọi thắc mắc về đơn hàng hay góp ý về dịch vụ, vui lòng để lại lời nhắn bên dưới. 
                        Đội ngũ CSKH sẽ phản hồi trong thời gian sớm nhất.
                    </Paragraph>
                </div>

                <Row gutter={[40, 40]} align="stretch">
                    {/* Form Liên Hệ */}
                    <Col xs={24} lg={14}>
                        <Card 
                            bordered={false} 
                            style={{ 
                                borderRadius: 32, 
                                boxShadow: '0 20px 40px rgba(255, 133, 162, 0.05)',
                                height: '100%'
                            }}
                        >
                            <div style={{ padding: '10px' }}>
                                <Title level={4} style={{ marginBottom: 30 }}>
                                    <SendOutlined style={{ color: '#ff85a2', marginRight: 12 }} />
                                    Gửi tin nhắn cho bộ phận hỗ trợ
                                </Title>

                                <Form
                                    layout="vertical"
                                    form={form}
                                    onFinish={handleSubmit}
                                    size="large"
                                    requiredMark={false}
                                >
                                    <Row gutter={16}>
                                        <Col xs={24} sm={12}>
                                            <Form.Item
                                                name="name"
                                                label={<Text strong>Họ và tên</Text>}
                                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                                            >
                                                <Input placeholder="Nguyễn Văn A" style={{ borderRadius: 12 }} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Form.Item
                                                name="email"
                                                label={<Text strong>Địa chỉ Email</Text>}
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập email' },
                                                    { type: 'email', message: 'Định dạng email không hợp lệ' }
                                                ]}
                                            >
                                                <Input placeholder="email@example.com" style={{ borderRadius: 12 }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        name="phone"
                                        label={<Text strong>Số điện thoại</Text>}
                                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                    >
                                        <Input placeholder="09xx xxx xxx" style={{ borderRadius: 12 }} />
                                    </Form.Item>

                                    <Form.Item
                                        name="subject"
                                        label={<Text strong>Tiêu đề</Text>}
                                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                                    >
                                        <Input placeholder="Chủ đề bạn muốn liên hệ" style={{ borderRadius: 12 }} />
                                    </Form.Item>

                                    <Form.Item
                                        name="message"
                                        label={<Text strong>Nội dung lời nhắn</Text>}
                                        rules={[{ required: true, message: 'Vui lòng viết nội dung liên hệ' }]}
                                    >
                                        <TextArea rows={5} placeholder="Nhập chi tiết nội dung tại đây..." style={{ borderRadius: 12 }} />
                                    </Form.Item>

                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        loading={loading}
                                        block
                                        style={{ 
                                            height: 54, 
                                            borderRadius: 16, 
                                            background: '#ff85a2', 
                                            border: 'none',
                                            fontSize: 17,
                                            fontWeight: 700,
                                            boxShadow: '0 8px 20px rgba(255, 133, 162, 0.3)',
                                            marginTop: 10
                                        }}
                                    >
                                        GỬI YÊU CẦU NGAY
                                    </Button>
                                </Form>
                            </div>
                        </Card>
                    </Col>

                    {/* Thông tin liên hệ & Social */}
                    <Col xs={24} lg={10}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            
                            {/* Card: Thông tin trực tiếp */}
                            <Card bordered={false} style={{ borderRadius: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
                                <Title level={4} style={{ marginBottom: 25 }}>
                                    <CustomerServiceOutlined style={{ color: '#ff85a2', marginRight: 12 }} />
                                    Thông tin kết nối
                                </Title>

                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                        <div style={{ background: '#fff0f3', padding: 12, borderRadius: 12 }}>
                                            <HomeOutlined style={{ color: '#ff85a2', fontSize: 20 }} />
                                        </div>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Văn phòng chính</Text>
                                            <Text strong style={{ fontSize: 15 }}>123 Đường ABC, Phường Bến Nghé, Quận 1, TP.HCM</Text>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                        <div style={{ background: '#fff0f3', padding: 12, borderRadius: 12 }}>
                                            <PhoneOutlined style={{ color: '#ff85a2', fontSize: 20 }} />
                                        </div>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Hotline hỗ trợ</Text>
                                            <Text strong style={{ fontSize: 15 }}>0909 123 456 / 028 999 888</Text>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                        <div style={{ background: '#fff0f3', padding: 12, borderRadius: 12 }}>
                                            <MailOutlined style={{ color: '#ff85a2', fontSize: 20 }} />
                                        </div>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Email doanh nghiệp</Text>
                                            <Text strong style={{ fontSize: 15 }}>support@phukienx.vn</Text>
                                        </div>
                                    </div>
                                </Space>

                                <Divider style={{ margin: '30px 0' }} />

                                <Title level={5} style={{ marginBottom: 20 }}><MessageOutlined style={{ color: '#ff85a2' }} /> Theo dõi chúng tôi</Title>
                                <Space size="middle">
                                    <Button shape="circle" icon={<FacebookOutlined />} style={{ color: '#1877f2', border: '1px solid #f0f0f0' }} />
                                    <Button shape="circle" icon={<InstagramOutlined />} style={{ color: '#e4405f', border: '1px solid #f0f0f0' }} />
                                    <Button shape="circle" icon={<YoutubeOutlined />} style={{ color: '#ff0000', border: '1px solid #f0f0f0' }} />
                                </Space>
                            </Card>

                            {/* Card: Quote/Banner hỗ trợ */}
                            <Card 
                                style={{ 
                                    borderRadius: 32, 
                                    background: 'linear-gradient(135deg, #2d3436 0%, #000000 100%)', 
                                    border: 'none',
                                    padding: '10px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                                    <div style={{ fontSize: 30 }}>✨</div>
                                    <div>
                                        <Title level={5} style={{ color: '#fff', margin: 0 }}>Phản hồi siêu tốc</Title>
                                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                                            Chúng tôi thường phản hồi tin nhắn trong vòng chưa đầy 2 giờ làm việc.
                                        </Text>
                                    </div>
                                </div>
                            </Card>
                        </Space>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Contact;