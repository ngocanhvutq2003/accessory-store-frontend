import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Typography, message, Popconfirm, Empty, Image, Card, Row, Col, Divider, Space, Tag } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/helpers';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { fetchCartCount } = useContext(CartContext);
    const navigate = useNavigate();

    // Lấy thông tin User an toàn hơn
    const getUserData = () => {
        try {
            const userData = localStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Lỗi đọc dữ liệu user:', error);
            return null;
        }
    };

    const user = getUserData();
    const userId = user?.id;

    // Sử dụng useCallback để tránh lỗi ESLint về dependency
    const fetchCart = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/carts/${userId}`);
            setCartItems(res.data.data || []);
            fetchCartCount();
        } catch (err) {
            message.error('Không thể tải giỏ hàng');
        } finally {
            setLoading(false);
        }
    }, [userId, fetchCartCount]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleQuantityChange = async (newQuantity, cartItemId) => {
        if (newQuantity < 1 || newQuantity > 99) return;

        const originalItems = [...cartItems];
        setCartItems(prev => prev.map(item => 
            item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        ));

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/carts/update`, {
                cartItemId,
                quantity: newQuantity
            });
            fetchCartCount();
        } catch (error) {
            setCartItems(originalItems);
            message.error('Lỗi khi cập nhật số lượng');
        }
    };

    const handleRemove = async (cartItemId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/carts/remove`, {
                data: { cartItemId }
            });
            message.success('Đã xóa sản phẩm');
            setCartItems(prev => prev.filter(item => item.id !== cartItemId));
            fetchCartCount();
        } catch {
            message.error('Lỗi khi xóa sản phẩm');
        }
    };

    if (!userId) {
        return (
            <div style={{ padding: '100px 20px', textAlign: 'center' }}>
                <Empty
                    description={<Title level={4}>Vui lòng đăng nhập để xem giỏ hàng</Title>}
                >
                    <Button type="primary" size="large" onClick={() => navigate('/login')} shape="round">
                        Đăng nhập ngay
                    </Button>
                </Empty>
            </div>
        );
    }

    const columns = [
        {
            title: 'SẢN PHẨM',
            key: 'product_info',
            render: (_, record) => (
                <Space size="large">
                    <Image
                        src={`${record.product?.image}`}
                        alt={record.product?.name}
                        width={80}
                        height={80}
                        style={{ objectFit: 'cover', borderRadius: 12 }}
                        fallback="https://via.placeholder.com/80"
                    />
                    <div>
                        <Text strong style={{ fontSize: 16, display: 'block' }}>{record.product?.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>Đơn giá: {formatCurrency(Number(record.price))}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'SỐ LƯỢNG',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            render: (quantity, record) => (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: '#f5f5f5', 
                    borderRadius: 8,
                    padding: '2px 8px'
                }}>
                    <Button 
                        type="text" 
                        size="small"
                        icon={<MinusOutlined />} 
                        onClick={() => handleQuantityChange(quantity - 1, record.id)}
                        disabled={quantity <= 1}
                    />
                    <Text strong style={{ width: 40, textAlign: 'center' }}>{quantity}</Text>
                    <Button 
                        type="text" 
                        size="small"
                        icon={<PlusOutlined />} 
                        onClick={() => handleQuantityChange(quantity + 1, record.id)}
                    />
                </div>
            )
        },
        {
            title: 'TỔNG',
            key: 'subtotal',
            align: 'right',
            render: (_, record) => (
                <Text strong style={{ color: '#ff85a2', fontSize: 16 }}>
                    {formatCurrency(record.price * record.quantity)}
                </Text>
            )
        },
        {
            title: '',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Popconfirm title="Xóa sản phẩm này?" onConfirm={() => handleRemove(record.id)}>
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            )
        }
    ];

    const totalAmount = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    return (
        <div style={{ background: '#fffaf9', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <Space size="middle" style={{ marginBottom: 24 }}>
                    <ShoppingCartOutlined style={{ fontSize: 28, color: '#ff85a2' }} />
                    <Title level={2} style={{ margin: 0 }}>Giỏ hàng</Title>
                    <Tag color="pink">{cartItems.length} sản phẩm</Tag>
                </Space>

                {cartItems.length === 0 && !loading ? (
                    <Card style={{ borderRadius: 24, textAlign: 'center', padding: '60px 0' }}>
                        <Empty description="Giỏ hàng của bạn đang trống" />
                        <Button 
                            type="primary" 
                            icon={<ArrowLeftOutlined />} 
                            style={{ marginTop: 20, background: '#ff85a2', border: 'none' }}
                            onClick={() => navigate('/')}
                        >
                            Mua sắm ngay
                        </Button>
                    </Card>
                ) : (
                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={16}>
                            <Card variant="borderless" style={{ borderRadius: 24 }}>
                                <Table
                                    dataSource={cartItems}
                                    columns={columns}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={false}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Card style={{ borderRadius: 24, position: 'sticky', top: 20 }}>
                                <Title level={4}>Hóa đơn</Title>
                                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0' }}>
                                    <Text type="secondary">Tạm tính</Text>
                                    <Text strong>{formatCurrency(totalAmount)}</Text>
                                </div>
                                <Divider />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                                    <Text strong style={{ fontSize: 18 }}>Tổng tiền</Text>
                                    <Text strong style={{ fontSize: 22, color: '#ff85a2' }}>{formatCurrency(totalAmount)}</Text>
                                </div>
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    style={{ height: 50, borderRadius: 12, background: '#ff85a2', border: 'none' }}
                                    onClick={() => navigate('/order')}
                                >
                                    Thanh toán ngay
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>
        </div>
    );
};

export default CartPage;