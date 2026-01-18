import React from 'react';
import { Result, Button, Card, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CustomerServiceOutlined, ArrowLeftOutlined } from '@ant-design/icons';

// Khai báo Typography các thành phần cần thiết
const { Title, Text, Paragraph } = Typography;

const PaymentFail = () => {
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
                variant="false"
                style={{
                    maxWidth: 600,
                    width: '100%',
                    borderRadius: 30,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    textAlign: 'center'
                }}
            >
                <Result
                    status="error"
                    title={
                        <Title level={2} style={{ color: '#ff4d4f', marginBottom: 0 }}>
                            Thanh toán thất bại
                        </Title>
                    }
                    subTitle={
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <Text type="secondary" style={{ fontSize: 16 }}>
                                Rất tiếc, đã có lỗi xảy ra trong quá trình xử lý giao dịch của bạn.
                            </Text>
                            
                            <Card
                                size="small"
                                style={{ 
                                    background: '#fff1f0', 
                                    border: '1px dashed #ffa39e', 
                                    borderRadius: 15,
                                    marginTop: 10 
                                }}
                            >
                                <Paragraph style={{ margin: 0, textAlign: 'left', fontSize: 13 }}>
                                    <Text strong>Lý do có thể xảy ra:</Text>
                                    <ul style={{ paddingLeft: 20, marginTop: 8, color: '#595959' }}>
                                        <li>Số dư tài khoản không đủ để thanh toán.</li>
                                        <li>Kết nối mạng bị gián đoạn giữa chừng.</li>
                                        <li>Thông tin thẻ hoặc tài khoản chưa chính xác.</li>
                                        <li>Phiên giao dịch đã hết hạn (timeout).</li>
                                    </ul>
                                </Paragraph>
                            </Card>
                        </Space>
                    }
                    extra={[
                        <Button
                            type="primary"
                            key="retry"
                            size="large"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/cart')}
                            style={{
                                borderRadius: 12,
                                background: '#ff85a2',
                                border: 'none',
                                height: 50,
                                padding: '0 30px',
                                fontWeight: 600
                            }}
                        >
                            THỬ LẠI TRONG GIỎ HÀNG
                        </Button>,
                        <Button
                            key="home"
                            size="large"
                            onClick={() => navigate('/')}
                            style={{
                                borderRadius: 12,
                                height: 50,
                                padding: '0 30px'
                            }}
                        >
                            VỀ TRANG CHỦ
                        </Button>
                    ]}
                >
                    <div style={{ marginTop: 10 }}>
                        <Text type="secondary">
                            Cần hỗ trợ ngay?{' '}
                            <Button 
                                type="link" 
                                icon={<CustomerServiceOutlined />} 
                                style={{ color: '#ff85a2', padding: 0 }}
                                onClick={() => window.open('tel:0123456789')} // Thay bằng số hotline của bạn
                            >
                                Liên hệ hỗ trợ
                            </Button>
                        </Text>
                    </div>
                </Result>
            </Card>
        </div>
    );
};

export default PaymentFail;