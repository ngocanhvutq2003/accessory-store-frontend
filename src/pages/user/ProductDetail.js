/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Typography, Spin, InputNumber, Button, Row, Col, Divider, Tag, Space, Breadcrumb, Card } from 'antd';
import { ShoppingCartOutlined, ThunderboltOutlined, HomeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { CartContext } from './CartContext';
import toast, { Toaster } from 'react-hot-toast';
import { formatCurrency } from '../../utils/helpers';

const { Title, Text, Paragraph } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const ProductDetail = () => {
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { fetchCartCount } = useContext(CartContext);

    const productId = location.state?.id;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${API_URL}/products/${slug}`);
                setProduct(res.data.data);
            } catch (err) {
                toast.error("Không tải được sản phẩm");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    const handleAddToCart = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.id) {
            toast.error('Bạn cần đăng nhập để thêm sản phẩm');
            navigate('/auth/login');
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/carts/add`, { 
                userId: user.id, 
                productId: productId || product.id, 
                quantity 
            });
            if (res.status === 200 || res.status === 201) {
                toast.success(`Đã thêm vào giỏ hàng thành công!`);
                fetchCartCount();
            }
        } catch (err) {
            toast.error('Thêm vào giỏ hàng thất bại');
        }
    };

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '100px 0', background: '#fffaf9', minHeight: '100vh' }}>
            <Spin size="large" tip="Đang tải siêu phẩm..." />
        </div>
    );

    if (!product) return <div style={{ padding: 50, textAlign: 'center' }}>Sản phẩm không tồn tại</div>;

    return (
        <div style={{ background: '#fffaf9', minHeight: '100vh', padding: '20px 0' }}>
            <Toaster position="top-center" />
            
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
                {/* Breadcrumb - Điều hướng */}
                <Breadcrumb style={{ marginBottom: 20 }}>
                    <Breadcrumb.Item href="/"><HomeOutlined /></Breadcrumb.Item>
                    <Breadcrumb.Item href="/product">Sản phẩm</Breadcrumb.Item>
                    <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
                </Breadcrumb>

                <Card borderless style={{ borderRadius: 30, boxShadow: '0 15px 40px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <Row gutter={[40, 40]}>
                        {/* Cột trái: Hình ảnh */}
                        <Col xs={24} md={10}>
                            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20 }}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{ 
                                        width: '100%', 
                                        height: 'auto', 
                                        aspectRatio: '1/1',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s'
                                    }}
                                    className="product-main-image"
                                />
                                {product.discount && (
                                    <Tag color="volcano" style={{ position: 'absolute', top: 20, left: 20, padding: '5px 15px', fontSize: 16, borderRadius: 10 }}>
                                        -{product.discount.percentage}%
                                    </Tag>
                                )}
                            </div>
                        </Col>

                        {/* Cột phải: Thông tin */}
                        <Col xs={24} md={14}>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <div>
                                    <Tag color="pink" style={{ marginBottom: 8 }}>{product.category?.name || 'Phụ kiện'}</Tag>
                                    <Title level={1} style={{ margin: 0, color: '#262626' }}>{product.name}</Title>
                                    <Space split={<Divider type="vertical" />} style={{ marginTop: 8 }}>
                                        <Text type="secondary"><CheckCircleOutlined style={{ color: '#52c41a' }} /> Chính hãng</Text>
                                        <Text type="secondary">Đã bán: 1.2k</Text>
                                    </Space>
                                </div>

                                <div style={{ background: '#fff0f3', padding: '20px', borderRadius: 20 }}>
                                    {product.discount ? (
                                        <Space align="baseline" size="large">
                                            <Title level={2} style={{ color: '#ff4d4f', margin: 0 }}>
                                                {formatCurrency(Number(product.finalPrice))}
                                            </Title>
                                            <Text delete type="secondary" style={{ fontSize: 18 }}>
                                                {formatCurrency(Number(product.originalPrice))}
                                            </Text>
                                        </Space>
                                    ) : (
                                        <Title level={2} style={{ color: '#ff85a2', margin: 0 }}>
                                            {product.price ? formatCurrency(Number(product.price)) : "Liên hệ"}
                                        </Title>
                                    )}
                                </div>

                                <div>
                                    <Text strong>Mô tả sản phẩm:</Text>
                                    <Paragraph style={{ marginTop: 8, color: '#595959', fontSize: 16 }}>
                                        {product.description || 'Sản phẩm đang được cập nhật thông tin chi tiết từ nhà sản xuất.'}
                                    </Paragraph>
                                </div>

                                <Divider style={{ margin: '12px 0' }} />

                                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                    <Text strong>Số lượng:</Text>
                                    <InputNumber 
                                        min={1} 
                                        max={100} 
                                        value={quantity} 
                                        onChange={setQuantity} 
                                        style={{ borderRadius: 8, height: 40, width: 80, display: 'flex', alignItems: 'center' }}
                                    />
                                    <Text type="secondary">({product.is_active ? 'Còn hàng' : 'Tạm hết hàng'})</Text>
                                </div>

                                <Row gutter={16} style={{ marginTop: 24 }}>
                                    <Col span={12}>
                                        <Button 
                                            block
                                            size="large"
                                            type="primary"
                                            icon={<ThunderboltOutlined />}
                                            onClick={() => toast.success("Đang chuyển đến trang thanh toán...")}
                                            style={{ height: 55, borderRadius: 15, background: '#ff85a2', border: 'none', fontWeight: 600 }}
                                        >
                                            MUA NGAY
                                        </Button>
                                    </Col>
                                    <Col span={12}>
                                        <Button 
                                            block
                                            size="large"
                                            icon={<ShoppingCartOutlined />}
                                            disabled={!product.is_active}
                                            onClick={handleAddToCart}
                                            style={{ 
                                                height: 55, 
                                                borderRadius: 15, 
                                                borderColor: '#ff85a2', 
                                                color: '#ff85a2',
                                                fontWeight: 600 
                                            }}
                                        >
                                            THÊM VÀO GIỎ
                                        </Button>
                                    </Col>
                                </Row>
                                
                                <div style={{ marginTop: 20, display: 'flex', gap: 20 }}>
                                    <Text style={{ fontSize: 12 }} type="secondary">🚚 Giao hàng miễn phí đơn từ 500k</Text>
                                    <Text style={{ fontSize: 12 }} type="secondary">🔄 Đổi trả trong 7 ngày</Text>
                                </div>
                            </Space>
                        </Col>
                    </Row>
                </Card>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .product-main-image:hover {
                    transform: scale(1.05);
                }
                .ant-btn-primary:hover {
                    background: #ff6a8e !important;
                    box-shadow: 0 4px 15px rgba(255, 133, 162, 0.4);
                }
            `}} />
        </div>
    );
};

export default ProductDetail;