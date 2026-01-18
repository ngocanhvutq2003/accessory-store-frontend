import React from 'react';
import { Button, Typography, Card, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CheckCircleFilled, ShoppingOutlined, HistoryOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <div style={{ 
            background: '#fffaf9', 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px'
        }}>
            <Card 
                style={{ 
                    maxWidth: 600, 
                    width: '100%', 
                    textAlign: 'center', 
                    borderRadius: 30,
                    boxShadow: '0 10px 30px rgba(255, 133, 162, 0.1)',
                    border: '1px solid #ffe6e1'
                }}
            >
                {/* Icon thành công với hiệu ứng màu hồng chủ đạo */}
                <div style={{ marginBottom: 24 }}>
                    <CheckCircleFilled style={{ fontSize: 80, color: '#52c41a' }} />
                </div>

                <Title level={2} style={{ color: '#ff85a2', marginBottom: 16 }}>
                    Đặt hàng thành công!
                </Title>

                <Paragraph style={{ fontSize: 16, color: '#595959' }}>
                    Cảm ơn bạn đã tin tưởng và lựa chọn <Text strong style={{ color: '#ff85a2' }}>Phụ Kiện X</Text>.<br />
                    Đơn hàng của bạn đã được tiếp nhận và đang trong quá trình chuẩn bị để gửi đến bạn sớm nhất.
                </Paragraph>

                <div style={{ 
                    background: '#fff0f3', 
                    padding: '20px', 
                    borderRadius: 20, 
                    marginBottom: 32,
                    border: '1px dashed #ff85a2'
                }}>
                    <Space direction="vertical">
                        <Text type="secondary">Bạn sẽ nhận được email xác nhận đơn hàng trong giây lát.</Text>
                        <Text strong>Mọi thắc mắc vui lòng liên hệ: 090x xxx xxx</Text>
                    </Space>
                </div>

                {/* Các nút điều hướng */}
                <Space size="middle" wrap style={{ justifyContent: 'center', width: '100%' }}>
                    <Button 
                        type="primary" 
                        size="large" 
                        icon={<HomeOutlined />}
                        onClick={() => navigate('/')}
                        style={{ 
                            borderRadius: 12, 
                            height: 45, 
                            background: '#ff85a2', 
                            border: 'none',
                            fontWeight: 600,
                            padding: '0 30px'
                        }}
                    >
                        Quay lại trang chủ
                    </Button>
                    
                    <Button 
                        size="large" 
                        icon={<HistoryOutlined />}
                        onClick={() => navigate('/order-history')}
                        style={{ 
                            borderRadius: 12, 
                            height: 45,
                            fontWeight: 600,
                            padding: '0 30px',
                            color: '#ff85a2',
                            borderColor: '#ff85a2'
                        }}
                    >
                        Xem lịch sử mua hàng
                    </Button>
                </Space>

                <div style={{ marginTop: 40 }}>
                    <ShoppingOutlined style={{ fontSize: 24, color: '#ff85a2', opacity: 0.5 }} />
                </div>
            </Card>
        </div>
    );
};

export default PaymentSuccess;