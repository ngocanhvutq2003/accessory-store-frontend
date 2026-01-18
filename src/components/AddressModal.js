import React, { useState, useEffect } from 'react';
import { Modal, Select, Input, Button, message } from 'antd';
import axios from 'axios';

const { Option } = Select;
const API_URL = `${process.env.REACT_APP_API_URL}/address`;

const AddressModal = ({ visible, onClose, onConfirm }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [street, setStreet] = useState('');

    const fetchData = async (url, setter) => {
        try {
            const res = await axios.get(url);
            setter(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error(error);
            message.error('Không thể tải dữ liệu địa chỉ');
            setter([]);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchData(`${API_URL}/provinces`, setProvinces);
        }
    }, [visible]);

    useEffect(() => {
        if (selectedProvince) {
            fetchData(
                `${API_URL}/districts/${selectedProvince.code}`,
                setDistricts
            );
        } else {
            setDistricts([]);
        }
        setSelectedDistrict(null);
        setSelectedWard(null);
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            fetchData(
                `${API_URL}/wards/${selectedDistrict.code}`,
                setWards
            );
        } else {
            setWards([]);
        }
        setSelectedWard(null);
    }, [selectedDistrict]);

    const handleConfirm = () => {
        if (!street || !selectedProvince || !selectedDistrict || !selectedWard) {
            return message.warning('Vui lòng nhập đầy đủ địa chỉ');
        }

        const fullAddress = `${street}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`;
        onConfirm(fullAddress);
        onClose();
    };

    const renderSelect = (placeholder, options, selected, onChange) => (
        <Select
            placeholder={placeholder}
            value={selected?.code}
            onChange={code =>
                onChange(options.find(item => item.code === code))
            }
            allowClear
        >
            {options.map(item => (
                <Option key={item.code} value={item.code}>
                    {item.name}
                </Option>
            ))}
        </Select>
    );

    return (
        <Modal
            title="Chọn địa chỉ giao hàng"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>Hủy</Button>,
                <Button key="ok" type="primary" onClick={handleConfirm}>
                    Xác nhận
                </Button>
            ]}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Input
                    placeholder="Số nhà / Đường"
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                />
                {renderSelect('Chọn tỉnh/thành phố', provinces, selectedProvince, setSelectedProvince)}
                {renderSelect('Chọn quận/huyện', districts, selectedDistrict, setSelectedDistrict)}
                {renderSelect('Chọn phường/xã', wards, selectedWard, setSelectedWard)}
            </div>
        </Modal>
    );
};

export default AddressModal;
