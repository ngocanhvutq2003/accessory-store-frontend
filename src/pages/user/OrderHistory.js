import React, { useEffect, useState, useCallback } from 'react';
import { Table, Card, Spin, message, Typography, Tag, Empty, Divider, Space, Row, Col } from 'antd'; // Đã thêm Row, Col
import { ClockCircleOutlined, ProductOutlined, HistoryOutlined } from '@ant-design/icons'; // Đã đổi PackageOutlined thành ProductOutlined
import axios from 'axios';
import { formatCurrency } from '../../utils/helpers';

const { Title, Text } = Typography;

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;

    const renderStatusTag = (status) => {
        const statusConfig = {
            pending: { color: 'gold', text: 'Chờ xử lý' },
            processing: { color: 'blue', text: 'Đang xử lý' },
            shipped: { color: 'cyan', text: 'Đang giao' },
            completed: { color: 'success', text: 'Đã hoàn thành' },
            cancelled: { color: 'error', text: 'Đã hủy' },
        };
        const config = statusConfig[status?.toLowerCase()] || { color: 'default', text: status };
        return <Tag color={config.color} style={{ borderRadius: 8 }}>{config.text.toUpperCase()}</Tag>;
    };

    const fetchOrders = useCallback(async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            return;
        }

        try {
            setLoading(true);
            const user = JSON.parse(storedUser);
            const userId = user.id;

            const res = await axios.get(`${API_URL}/orders/user/${userId}/details`);
            const sortedOrders = (res.data.data || []).sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setOrders(sortedOrders);
        } catch (error) {
            console.error('Fetch orders error:', error);
            message.error('Không thể tải lịch sử đơn hàng');
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'SL',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            width: 80,
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            render: (price) => formatCurrency(Number(price)),
        },
        {
            title: 'Thành tiền',
            key: 'total',
            align: 'right',
            render: (_, record) => (
                <Text strong style={{ color: '#ff85a2' }}>
                    {formatCurrency(Number(record.price * record.quantity))}
                </Text>
            ),
        },
    ];

    return (
        <div style={{ background: '#fffaf9', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <Title level={2} style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <HistoryOutlined style={{ color: '#ff85a2' }} />
                    Lịch sử đơn hàng
                </Title>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <Spin size="large" />
                    </div>
                ) : orders.length === 0 ? (
                    <Card style={{ borderRadius: 20, textAlign: 'center', padding: '60px 0' }}>
                        <Empty description="Bạn chưa có đơn hàng nào" />
                    </Card>
                ) : (
                    orders.map((order) => (
                        <Card
                            key={order.id}
                            style={{ 
                                marginBottom: '24px', 
                                borderRadius: 20, 
                                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                overflow: 'hidden'
                            }}
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                                    <Space>
                                        <ProductOutlined style={{ color: '#ff85a2' }} />
                                        <span>Đơn hàng #{order.id}</span>
                                    </Space>
                                    {renderStatusTag(order.status)}
                                </div>
                            }
                        >
                            <div style={{ marginBottom: 20 }}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={12}>
                                        <Text type="secondary"><ClockCircleOutlined /> Ngày đặt: </Text>
                                        <Text>{new Date(order.createdAt).toLocaleString('vi-VN')}</Text>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Text type="secondary">📍 Địa chỉ: </Text>
                                        <Text>{order.shipping_address}</Text>
                                    </Col>
                                </Row>
                            </div>

                            <Table
                                columns={columns}
                                dataSource={(order.items || []).map((item) => ({
                                    key: item.id,
                                    product: item.product?.name || 'Sản phẩm',
                                    quantity: item.quantity,
                                    price: item.price,
                                }))}
                                pagination={false}
                                size="small"
                            />

                            <Divider />
                            
                            <div style={{ textAlign: 'right' }}>
                                <Text style={{ fontSize: 16 }}>Tổng cộng: </Text>
                                <Title level={3} style={{ margin: 0, color: '#ff85a2', display: 'inline-block' }}>
                                    {formatCurrency(Number(order.total_price))}
                                </Title>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrderHistory;