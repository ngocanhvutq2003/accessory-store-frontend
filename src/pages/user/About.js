import { Row, Col, Typography, Card, Button, Tag, Space, Divider, ConfigProvider } from 'antd';
import {
    SafetyCertificateOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    ClockCircleOutlined,
    ShopOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const About = () => {
    // Cấu hình theme riêng cho trang About để đảm bảo màu sắc đồng nhất
    const themeConfig = {
        token: {
            colorPrimary: '#ff85a2',
            borderRadius: 12,
        },
    };

    return (
        <ConfigProvider theme={themeConfig}>
            <div style={{ background: '#fffaf9', minHeight: '100vh', paddingBottom: 60 }}>
                {/* Hero Section - Cải thiện độ dốc màu và bo góc */}
                <div
                    style={{
                        background: 'linear-gradient(180deg, #ffeef2 0%, #fffaf9 100%)',
                        padding: '100px 20px',
                        textAlign: 'center',
                        marginBottom: 40
                    }}
                >
                    <Space direction="vertical" size="large" style={{ maxWidth: 900 }}>
                        <Tag color="#ff85a2" style={{ border: 'none', px: 15, py: 2, fontWeight: 500 }}>
                            CHÀO MỪNG ĐẾN VỚI PHỤ KIỆN X
                        </Tag>
                        <Title level={1} style={{ fontSize: 'clamp(32px, 8vw, 56px)', margin: 0, fontWeight: 800 }}>
                            Nâng tầm <span style={{ color: '#ff85a2' }}>phong cách</span> của bạn
                        </Title>
                        <Paragraph style={{ fontSize: 18, color: '#595959', lineHeight: 1.8 }}>
                            Chúng tôi cung cấp những món đồ phụ kiện được tuyển chọn kỹ lưỡng, giúp bạn hoàn thiện vẻ ngoài 
                            và khẳng định cá tính riêng biệt mỗi ngày.
                        </Paragraph>
                        <Button 
                            type="primary" 
                            size="large" 
                            shape="round"
                            icon={<ArrowRightOutlined />} 
                            style={{ height: 50, padding: '0 40px', fontWeight: 600 }}
                        >
                            Khám phá bộ sưu tập
                        </Button>
                    </Space>
                </div>

                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
                    {/* Features Section - Sử dụng Card hoverable của Antd thay vì e.target */}
                    <Row gutter={[24, 24]}>
                        {[
                            { icon: <ShopOutlined />, title: 'Sản phẩm đa dạng', desc: 'Hơn 1000+ mẫu phụ kiện từ túi xách, kính mắt đến trang sức cao cấp.' },
                            { icon: <SafetyCertificateOutlined />, title: 'Cam kết chất lượng', desc: 'Mọi sản phẩm đều có nguồn gốc rõ ràng và chế độ bảo hành dài hạn.' },
                            { icon: <DollarOutlined />, title: 'Giá cả tối ưu', desc: 'Mang đến giá trị tốt nhất cho khách hàng với nhiều phân khúc giá hợp lý.' },
                        ].map((item, index) => (
                            <Col xs={24} sm={12} md={8} key={index}>
                                <Card
                                    hoverable
                                    bordered={false}
                                    style={{ height: '100%', textAlign: 'center', borderRadius: 24, boxShadow: '0 10px 20px rgba(0,0,0,0.02)' }}
                                >
                                    <div style={{ fontSize: 40, color: '#ff85a2', marginBottom: 16 }}>{item.icon}</div>
                                    <Title level={4}>{item.title}</Title>
                                    <Text type="secondary">{item.desc}</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Divider style={{ margin: '80px 0' }} />

                    {/* Info & Contact - Tối ưu UX cho Mobile */}
                    <Row gutter={[40, 40]} align="middle">
                        <Col xs={24} md={12}>
                            <Title level={2}>Hỗ trợ khách hàng tận tâm</Title>
                            <Paragraph style={{ fontSize: 16, marginBottom: 30 }}>
                                Chúng tôi không chỉ bán sản phẩm, chúng tôi mang lại trải nghiệm mua sắm tuyệt vời nhất. 
                                Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn chọn được món đồ ưng ý.
                            </Paragraph>
                            
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', gap: 15 }}>
                                    <ClockCircleOutlined style={{ fontSize: 24, color: '#ff85a2', marginTop: 4 }} />
                                    <div>
                                        <Text strong style={{ fontSize: 16 }}>Giờ làm việc</Text><br />
                                        <Text type="secondary">Thứ 2 - CN: 08:00 - 22:00</Text>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 15 }}>
                                    <EnvironmentOutlined style={{ fontSize: 24, color: '#ff85a2', marginTop: 4 }} />
                                    <div>
                                        <Text strong style={{ fontSize: 16 }}>Địa chỉ cửa hàng</Text><br />
                                        <Text type="secondary">123 Đường Thời Trang, Quận 1, TP. Hồ Chí Minh</Text>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 15 }}>
                                    <PhoneOutlined style={{ fontSize: 24, color: '#ff85a2', marginTop: 4 }} />
                                    <div>
                                        <Text strong style={{ fontSize: 16 }}>Hotline liên hệ</Text><br />
                                        <Text type="secondary">0909 123 456 (Zalo hỗ trợ 24/7)</Text>
                                    </div>
                                </div>
                            </Space>
                        </Col>
                        
                        <Col xs={24} md={12}>
                            {/* Chỗ này có thể để ảnh cửa hàng thực tế hoặc minh họa */}
                            <div style={{ 
                                borderRadius: 32, 
                                overflow: 'hidden', 
                                boxShadow: '0 20px 40px rgba(255, 133, 162, 0.15)',
                                lineHeight: 0
                            }}>
                                <img 
                                    src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80" 
                                    alt="Cửa hàng" 
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        </Col>
                    </Row>

                    {/* Google Map - UX: Đảm bảo iframe có độ bo góc mượt mà */}
                    <div style={{ marginTop: 80 }}>
                        <div style={{ textAlign: 'center', marginBottom: 30 }}>
                            <Title level={3}>Ghé thăm chúng tôi</Title>
                        </div>
                        <div style={{ 
                            borderRadius: 24, 
                            overflow: 'hidden', 
                            border: '4px solid #fff', 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)' 
                        }}>
                            <iframe
                                title="Map Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.424302251034!2d106.7011985!3d10.7753444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4749365511%3A0xe0383187b5a59d9a!2sBen%20Thanh%20Market!5e0!3m2!1sen!2svn!4v1700000000000!5m2!1sen!2svn"
                                width="100%"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default About;