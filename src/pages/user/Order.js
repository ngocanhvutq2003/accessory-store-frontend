import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import {
    Table,
    Button,
    Typography,
    message,
    Empty,
    Input,
    Radio,
    Form,
    Card,
    Row,
    Col,
    Divider,
    Space
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { CreditCardOutlined, ShoppingOutlined, UserOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/helpers';
import { CartContext } from './CartContext';

const { Title, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const Order = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const { fetchCartCount } = useContext(CartContext);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // Lấy thông tin User an toàn
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const userId = user?.id;

    const fetchCart = useCallback(async () => {
        if (!userId) {
            message.warning('Vui lòng đăng nhập để thực hiện thanh toán');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/carts/${userId}`);
            setCartItems(res.data.data || []);
        } catch (err) {
            message.error('Không thể tải thông tin giỏ hàng');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchCart();
        // Set giá trị mặc định cho Form từ dữ liệu User có sẵn
        form.setFieldsValue({
            fullname: `${user.lastname || ''} ${user.firstname || ''}`.trim(),
            phone: user.phone || '',
        });
    }, [fetchCart, form, user.firstname, user.lastname, user.phone]);

    const handleConfirmOrder = async (values) => {
        if (cartItems.length === 0) return message.error('Giỏ hàng trống');

        setLoading(true);
        try {
            const items = cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            }));

            const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const res = await axios.post(`${API_URL}/orders`, {
                userId,
                items,
                totalPrice,
                note: values.note || '',
                shipping_address: values.address,
                phone: values.phone,
                paymentMethod: paymentMethod // 'cod' hoặc 'paypal'
            });

            if (paymentMethod === 'paypal' && res.data.approveUrl) {
                window.location.href = res.data.approveUrl;
                return;
            }

            // Xóa giỏ hàng sau khi đặt thành công (COD)
            await axios.delete(`${API_URL}/carts/clear/${userId}`);
            fetchCartCount();
            message.success('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
            navigate('/payment-success');
        } catch (error) {
            console.error('Order Error:', error);
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi xử lý đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.product?.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{formatCurrency(Number(record.price))}</Text>
                </Space>
            )
        },
        {
            title: 'SL',
            dataIndex: 'quantity',
            align: 'center',
            width: 60,
        },
        {
            title: 'Tổng',
            align: 'right',
            render: (_, record) => (
                <Text strong>{formatCurrency(record.price * record.quantity)}</Text>
            )
        }
    ];

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div style={{ background: '#fffaf9', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <Title level={2} style={{ marginBottom: 32 }}>
                    <ShoppingOutlined style={{ marginRight: 12, color: '#ff85a2' }} />
                    Thanh toán đơn hàng
                </Title>

                {cartItems.length === 0 && !loading ? (
                    <Card style={{ borderRadius: 20, textAlign: 'center', padding: '40px' }}>
                        <Empty description="Giỏ hàng của bạn đang trống" />
                        <Button type="primary" onClick={() => navigate('/')} style={{ marginTop: 16 }}>Quay lại mua sắm</Button>
                    </Card>
                ) : (
                    <Form form={form} layout="vertical" onFinish={handleConfirmOrder}>
                        <Row gutter={[24, 24]}>
                            {/* Cột trái: Thông tin giao hàng */}
                            <Col xs={24} lg={14}>
                                <Card title={<Space><UserOutlined /> Thông tin nhận hàng</Space>} variant="borderless" style={{ borderRadius: 20, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                    <Form.Item 
                                        name="fullname" 
                                        label="Họ và tên" 
                                        rules={[{ required: true, message: 'Vui lòng nhập họ tên người nhận' }]}
                                    >
                                        <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="Nguyễn Văn A" />
                                    </Form.Item>

                                    <Form.Item 
                                        name="phone" 
                                        label="Số điện thoại" 
                                        rules={[{ required: true, pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ (10 chữ số)' }]}
                                    >
                                        <Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} placeholder="09xxxxxxxx" />
                                    </Form.Item>

                                    <Form.Item 
                                        name="address" 
                                        label="Địa chỉ giao hàng chi tiết" 
                                        rules={[{ required: true, message: 'Vui lòng cung cấp địa chỉ giao hàng' }]}
                                    >
                                        <Input.TextArea prefix={<EnvironmentOutlined />} rows={3} placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố" />
                                    </Form.Item>

                                    <Form.Item name="note" label="Ghi chú đơn hàng (Tùy chọn)">
                                        <Input.TextArea rows={2} placeholder="Lời nhắn cho shipper hoặc cửa hàng..." />
                                    </Form.Item>
                                </Card>

                                <Card title={<Space><CreditCardOutlined /> Phương thức thanh toán</Space>} variant="borderless" style={{ borderRadius: 20, marginTop: 24, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                    <Radio.Group 
                                        onChange={e => setPaymentMethod(e.target.value)} 
                                        value={paymentMethod}
                                        style={{ width: '100%' }}
                                    >
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <Radio value="cod" className="custom-radio">Thanh toán khi nhận hàng (COD)</Radio>
                                            <Radio value="paypal" className="custom-radio">Thanh toán qua PayPal</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Card>
                            </Col>

                            {/* Cột phải: Tóm tắt đơn hàng */}
                            <Col xs={24} lg={10}>
                                <Card 
                                    title="Tóm tắt đơn hàng" 
                                    variant="borderless" 
                                    style={{ borderRadius: 20, position: 'sticky', top: 20, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}
                                >
                                    <Table
                                        dataSource={cartItems}
                                        columns={columns}
                                        rowKey="id"
                                        pagination={false}
                                        size="small"
                                        style={{ marginBottom: 20 }}
                                    />
                                    
                                    <Divider />
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <Text>Tạm tính:</Text>
                                        <Text strong>{formatCurrency(totalAmount)}</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <Text>Phí vận chuyển:</Text>
                                        <Text type="success">Miễn phí</Text>
                                    </div>
                                    
                                    <Divider />
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                                        <Text strong style={{ fontSize: 18 }}>Tổng cộng:</Text>
                                        <Text strong style={{ fontSize: 22, color: '#ff85a2' }}>{formatCurrency(totalAmount)}</Text>
                                    </div>

                                    <Button
                                        type="primary"
                                        size="large"
                                        htmlType="submit"
                                        loading={loading}
                                        block
                                        style={{ height: 50, borderRadius: 12, background: '#ff85a2', border: 'none', fontWeight: 600 }}
                                    >
                                        ĐẶT HÀNG NGAY
                                    </Button>
                                    <Text type="secondary" style={{ fontSize: 12, textAlign: 'center', display: 'block', marginTop: 12 }}>
                                        Bằng cách đặt hàng, bạn đồng ý với các điều khoản của chúng tôi.
                                    </Text>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                )}
            </div>
        </div>
    );
};

export default Order;