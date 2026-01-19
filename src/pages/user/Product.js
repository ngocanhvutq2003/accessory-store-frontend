/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input, Checkbox, Slider, Typography, Spin, Pagination, Upload, Button, Tooltip, Empty, Tag, Badge, Space, Divider } from 'antd';
import { CameraOutlined, SearchOutlined, FilterOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { formatCurrency } from '../../utils/helpers';

const { Title, Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const Product = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Đổi keyword thành object để chứa thông tin phong phú hơn từ AI
    const [aiInfo, setAiInfo] = useState({ active: false, detected: [], keyword: '' });

    const [filters, setFilters] = useState({
        category: [],
        price: [0, 5000000],
        keyword: '',
        page: 1,
        pageSize: 12
    });
    const [totalProducts, setTotalProducts] = useState(0);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/products`, {
                params: {
                    categories: filters.category.join(','),
                    priceMin: filters.price[0],
                    priceMax: filters.price[1],
                    search: filters.keyword,
                    page: filters.page,
                    pageSize: filters.pageSize
                }
            });
            setProducts(res.data.data || []);
            setTotalProducts(res.data.total || 0);
        } catch (err) {
            toast.error("Lỗi khi tải sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const handleImageSearch = async (options) => {
        const { file } = options;
        setLoading(true);
        setIsAiLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post(`${API_URL}/products/search-image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Backend mình vừa viết trả về: { success, data (mảng sản phẩm), total, keyword }
            if (res.data && res.data.success) {
                const searchRows = res.data.data || []; // data chính là result.rows từ backend
                setProducts(searchRows);
                setTotalProducts(res.data.total || searchRows.length);
                setAiInfo({
                    active: true,
                    // Vì MobileNet trả về 1 chuỗi, mình bỏ vào mảng để map ra Tag cho đẹp
                    detected: res.data.keyword ? [res.data.keyword] : ["Đang xác định..."],
                    keyword: res.data.keyword || ''
                });
                toast.success("AI đã nhận diện xong!");
            }
        } catch (err) {
            console.error("AI Search Error:", err);
            toast.error(err.response?.data?.message || "AI không thể nhận diện hình ảnh này");
            handleResetSearch();
        } finally {
            setLoading(false);
            setIsAiLoading(false);
        }
    };

    const handleResetSearch = () => {
        setAiInfo({ active: false, detected: [], keyword: '' });
        setFilters(prev => ({ ...prev, keyword: '', page: 1 }));
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/categories`);
                setCategories(res.data.data.map(cat => cat.name));
            } catch (err) { console.error(err); }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        // Chỉ fetch tự động nếu KHÔNG phải đang hiển thị kết quả AI
        if (!aiInfo.active) fetchProducts();
    }, [filters, aiInfo.active]);

    return (
        <div style={{ background: '#fffaf9', minHeight: '100vh', padding: '40px 20px' }}>
            <Toaster position="top-center" />
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>

                <Row gutter={[32, 32]}>
                    {/* BỘ LỌC BÊN TRÁI */}
                    <Col xs={24} lg={6}>
                        <Card
                            style={{
                                borderRadius: 24,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                                border: 'none',
                                position: 'sticky',
                                top: 20
                            }}
                        >
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div>
                                    <Title level={4} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <FilterOutlined style={{ color: '#ff85a2' }} /> Bộ lọc
                                    </Title>
                                    <Divider style={{ margin: '12px 0' }} />
                                </div>

                                <div>
                                    <Text strong>Tìm kiếm thông minh</Text>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                        <Input
                                            placeholder="Bạn tìm gì hôm nay?"
                                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                                            value={filters.keyword}
                                            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                            onPressEnter={() => {
                                                setAiInfo({ active: false, detected: [], keyword: '' });
                                                setFilters({ ...filters, page: 1 });
                                            }}
                                            style={{ borderRadius: 10 }}
                                        />
                                        <Upload customRequest={handleImageSearch} showUploadList={false} accept="image/*">
                                            <Tooltip title="Tìm ảnh tương đồng (AI)">
                                                <Button
                                                    icon={<CameraOutlined />}
                                                    loading={isAiLoading}
                                                    style={{
                                                        borderRadius: 10,
                                                        background: aiInfo.active ? '#ff85a2' : '#fff',
                                                        color: aiInfo.active ? '#fff' : '#ff85a2',
                                                        borderColor: '#ff85a2'
                                                    }}
                                                />
                                            </Tooltip>
                                        </Upload>
                                    </div>
                                </div>

                                <div>
                                    <Text strong>Danh mục</Text>
                                    <div style={{ marginTop: 12 }}>
                                        <Checkbox.Group
                                            options={categories}
                                            value={filters.category}
                                            onChange={(checked) => {
                                                setAiInfo({ active: false, detected: [], keyword: '' });
                                                setFilters({ ...filters, category: checked, page: 1 });
                                            }}
                                            className="custom-checkbox-group"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Text strong>Khoảng giá</Text>
                                    <Slider
                                        range
                                        min={0}
                                        max={5000000}
                                        step={50000}
                                        value={filters.price}
                                        onChange={(value) => setFilters({ ...filters, price: value })}
                                        onAfterChange={() => {
                                            setAiInfo({ active: false, detected: [], keyword: '' });
                                            setFilters(prev => ({ ...prev, page: 1 }));
                                        }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Tag color="pink">{formatCurrency(filters.price[0])}</Tag>
                                        <Tag color="pink">{formatCurrency(filters.price[1])}</Tag>
                                    </div>
                                </div>

                                {aiInfo.active && (
                                    <Button
                                        block
                                        danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={handleResetSearch}
                                        style={{ borderRadius: 10 }}
                                    >
                                        Xóa kết quả AI
                                    </Button>
                                )}
                            </Space>
                        </Card>
                    </Col>

                    {/* DANH SÁCH SẢN PHẨM */}
                    <Col xs={24} lg={18}>
                        <div style={{ marginBottom: 24 }}>
                            {aiInfo.active ? (
                                <Space direction="vertical" size={8}>
                                    <Text type="secondary">AI đã nhận diện được các đặc điểm:</Text>
                                    <Space wrap>
                                        {aiInfo.detected.map((label, index) => (
                                            <Tag color="magenta" key={index} style={{ borderRadius: 12, padding: '2px 12px' }}>
                                                {label}
                                            </Tag>
                                        ))}
                                    </Space>
                                    <Title level={4} style={{ marginTop: 10 }}>Sản phẩm tương đồng nhất:</Title>
                                </Space>
                            ) : (
                                <Title level={3} style={{ margin: 0 }}>
                                    {filters.keyword ? `Kết quả cho: "${filters.keyword}"` : "Khám phá phụ kiện"}
                                </Title>
                            )}
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                <Spin size="large" tip={isAiLoading ? "AI đang phân tích ảnh..." : "Đang tải..."} />
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <Row gutter={[20, 28]}>
                                    {products.map(p => (
                                        <Col xs={12} sm={8} md={6} key={p.id}>
                                            <Badge.Ribbon
                                                text={`-${Math.round(((p.originalPrice - p.finalPrice) / p.originalPrice) * 100)}%`}
                                                color="volcano"
                                                hidden={!p.discount}
                                            >
                                                <Card
                                                    hoverable
                                                    onClick={() => p.is_active && navigate(`/products/${p.slug}`, { state: { id: p.id } })}
                                                    style={{ borderRadius: 20, overflow: 'hidden', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}
                                                    cover={
                                                        <div style={{ height: 240, overflow: 'hidden', position: 'relative' }}>
                                                            <img src={p.image} alt={p.name} className="product-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            {!p.is_active && (
                                                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <Tag color="default">HẾT HÀNG</Tag>
                                                                </div>
                                                            )}
                                                        </div>
                                                    }
                                                >
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            {p.category?.name || (typeof p.category === 'string' ? p.category : '')}
                                                        </Text>
                                                        <Title level={5} ellipsis={{ tooltip: p.name }} style={{ margin: '4px 0 12px', fontSize: 15 }}>
                                                            {p.name}
                                                        </Title>
                                                        <Space align="baseline">
                                                            <Text strong style={{ color: '#ff85a2', fontSize: 17 }}>
                                                                {formatCurrency(p.finalPrice || p.price)}
                                                            </Text>
                                                            {p.discount && (
                                                                <Text delete type="secondary" style={{ fontSize: 12 }}>
                                                                    {formatCurrency(p.originalPrice)}
                                                                </Text>
                                                            )}
                                                        </Space>
                                                    </div>
                                                </Card>
                                            </Badge.Ribbon>
                                        </Col>
                                    ))}
                                </Row>

                                {!aiInfo.active && totalProducts > filters.pageSize && (
                                    <div style={{ textAlign: 'center', marginTop: 50 }}>
                                        <Pagination
                                            current={filters.page}
                                            pageSize={filters.pageSize}
                                            total={totalProducts}
                                            onChange={(page) => setFilters({ ...filters, page })}
                                            showSizeChanger={false}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={aiInfo.active ? "AI không tìm thấy sản phẩm nào tương đồng" : "Không tìm thấy sản phẩm nào"}
                                style={{ marginTop: 80 }}
                            >
                                {aiInfo.active && <Button onClick={handleResetSearch}>Quay lại danh sách</Button>}
                            </Empty>
                        )}
                    </Col>
                </Row>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-checkbox-group .ant-checkbox-wrapper { margin-left: 0 !important; margin-bottom: 8px; display: flex; align-items: center; }
                .product-image:hover { transform: scale(1.08); transition: all 0.5s; }
                .ant-btn-loading-icon { color: #ff85a2 !important; }
            `}} />
        </div>
    );
};

export default Product;