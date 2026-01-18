import React, { useEffect, useState, useCallback } from "react";
import { Card, Typography, Spin, Input, Row, Col, message, Tag, Empty, Space, Button } from "antd"; // Đã thêm Space, Button
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { 
    LeftOutlined, 
    RightOutlined, 
    ToolOutlined, 
    SafetyOutlined, 
    DollarOutlined, 
    RocketOutlined,
    FireOutlined
} from "@ant-design/icons";
import axios from "axios";
import { formatCurrency } from '../../utils/helpers';

const { Search } = Input;
const { Title, Text } = Typography;

const API_URL = process.env.REACT_APP_API_URL;

// Custom Arrow Button
const ArrowButton = ({ onClick, direction }) => (
    <div
        onClick={onClick}
        style={{
            position: "absolute",
            top: "45%",
            [direction]: "-25px",
            zIndex: 10,
            cursor: "pointer",
            background: "#fff",
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            color: "#ff85a2",
        }}
    >
        {direction === "left" ? <LeftOutlined /> : <RightOutlined />}
    </div>
);

// Render Giá
const RenderPrice = ({ p }) => {
    if (!p.price || p.price === 0) return <Text type="secondary">Liên hệ</Text>;
    if (p.discount && p.discount.percentage > 0) {
        return (
            <Space direction="vertical" size={0}>
                <Text delete type="secondary" style={{ fontSize: 12 }}>{formatCurrency(Number(p.price))}</Text>
                <Text strong style={{ color: "#ff85a2", fontSize: 16 }}>{formatCurrency(Number(p.finalPrice))}</Text>
            </Space>
        );
    }
    return <Text strong style={{ color: "#ff85a2", fontSize: 16 }}>{formatCurrency(Number(p.price))}</Text>;
};

const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <ArrowButton direction="right" />,
    prevArrow: <ArrowButton direction="left" />,
    responsive: [
        { breakpoint: 1400, settings: { slidesToShow: 4 } },
        { breakpoint: 1100, settings: { slidesToShow: 3 } },
        { breakpoint: 768, settings: { slidesToShow: 2, arrows: false, dots: true } },
        { breakpoint: 480, settings: { slidesToShow: 1.2, arrows: false, dots: true, centerMode: true } },
    ],
};

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const handleClick = () => navigate(`/products/${product.slug}`, { state: { id: product.id } });

    return (
        <Card
            hoverable
            onClick={handleClick}
            style={{
                borderRadius: 20,
                overflow: 'hidden',
                margin: "10px 8px",
                border: "1px solid #f0f0f0",
            }}
            cover={
                <div style={{ position: "relative", height: 220, overflow: 'hidden' }}>
                    {product.discount?.percentage > 0 && (
                        <Tag color="#ff85a2" style={{ position: "absolute", top: 12, left: 12, zIndex: 2, borderRadius: 8 }}>
                            -{product.discount.percentage}%
                        </Tag>
                    )}
                    <img 
                        src={product.image || "https://via.placeholder.com/300x300"} 
                        alt={product.name} 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                </div>
            }
        >
            <Card.Meta 
                title={<Text strong style={{ fontSize: 15 }}>{product.name}</Text>} 
                description={<RenderPrice p={product} />} 
            />
        </Card>
    );
};

const ProductSlider = ({ title, products, icon }) => {
    if (!products || products.length === 0) return null;
    return (
        <div style={{ marginBottom: 60 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, justifyContent: 'space-between' }}>
                <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
                    {icon && <span style={{ color: '#ff85a2' }}>{icon}</span>}
                    {title}
                </Title>
                <Button type="link" style={{ color: '#ff85a2' }}>Xem tất cả</Button>
            </div>
            <Slider {...sliderSettings}>
                {products.map(product => (
                    <div key={product.id}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const fetchHomeData = useCallback(async () => {
        try {
            setLoading(true);
            const [resFeatured, resCategories] = await Promise.all([
                axios.get(`${API_URL}/products`, { params: { featured: true } }),
                axios.get(`${API_URL}/categories/with-products`)
            ]);
            setFeaturedProducts(resFeatured.data.data || []);
            setCategories(resCategories.data.data || []);
        } catch (err) {
            message.error("Không thể tải dữ liệu trang chủ");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHomeData();
    }, [fetchHomeData]);

    const onSearch = (value) => {
        const keyword = value.trim();
        if (keyword) navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    };

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin size="large" />
        </div>
    );

    return (
        <div style={{ background: "#fffaf9", minHeight: "100vh" }}>
            {/* Hero Section */}
            <div style={{ 
                background: "linear-gradient(180deg, #ffeef2 0%, #fffaf9 100%)", 
                padding: "80px 20px", 
                textAlign: 'center' 
            }}>
                <Title style={{ fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 800 }}>
                    Nâng tầm <span style={{ color: '#ff85a2' }}>phong cách</span> mỗi ngày
                </Title>
                <div style={{ maxWidth: 600, margin: "40px auto 0" }}>
                    <Search 
                        placeholder="Tìm kiếm phụ kiện..." 
                        enterButton="Tìm ngay"
                        onSearch={onSearch} 
                        size="large"
                    />
                </div>
            </div>

            <div style={{ maxWidth: 1250, margin: "0 auto", padding: "0 20px" }}>
                {/* Features Section */}
                <Row gutter={[24, 24]} style={{ marginTop: -40, marginBottom: 80 }}>
                    {[
                        { icon: <ToolOutlined />, title: "Phụ kiện đa dạng" },
                        { icon: <SafetyOutlined />, title: "Chất lượng cao" },
                        { icon: <DollarOutlined />, title: "Giá hợp lý" },
                        { icon: <RocketOutlined />, title: "Giao nhanh" },
                    ].map((item, index) => (
                        <Col xs={12} md={6} key={index}>
                            <Card bordered={false} style={{ borderRadius: 20, textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <div style={{ fontSize: 32, color: '#ff85a2', marginBottom: 12 }}>{item.icon}</div>
                                <Text strong>{item.title}</Text>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Sản phẩm nổi bật */}
                <ProductSlider 
                    title="Sản phẩm nổi bật" 
                    products={featuredProducts} 
                    icon={<FireOutlined />} 
                />

                {/* Danh mục */}
                {categories.length > 0 ? (
                    categories.map(cat => (
                        <ProductSlider key={cat.id} title={cat.name} products={cat.products || []} />
                    ))
                ) : (
                    <Empty description="Đang cập nhật thêm sản phẩm..." />
                )}
            </div>
        </div>
    );
};

export default Home;