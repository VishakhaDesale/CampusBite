import { QRCodeSVG } from 'qrcode.react';
import { ReloadOutlined, QuestionOutlined, LoadingOutlined, LockOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, notification, Space, message, Spin, Card, Typography } from 'antd';
import { useState, useEffect } from "react";
import api from '../..';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

export default function QRCodePage() {
    const [loading, setLoading] = useState(false);
    const [rawCode, setRawCode] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get('api/user/data');
                const code = response.data.secret + response.data.email;
                setRawCode(code);
                setInitialLoading(false);
                setLoading(false);
            } catch (error) {
                message.error('Failed to fetch QR code');
                setInitialLoading(false);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleCreateNew = async () => {
        setLoading(true);
        try {
            const response = await api.get('api/user/resetSecret');
            const code = response.data.secret + response.data.email;
            setRawCode(code);
            setLoading(false);
            message.success({
                content: 'New QR code created successfully',
                icon: <LockOutlined style={{ color: '#52c41a' }} />
            });
        } catch (error) {
            setLoading(false);
            message.error('Failed to create new QR code');
        }
    };

    const showInfo = () => {
        notification.info({
            message: <Title level={4}>Security Information</Title>,
            description: 
                <Text>
                    Keep your QR code private and secure. If you think it has been compromised, 
                    click the "Create New" button to generate a new one immediately.
                </Text>,
            message: <b>Information</b>,
            description: 'Keep your QR code private. If you think it has been compromised, reissue a new one using this Create New button.',
            placement: 'top',
            closeIcon: <CloseOutlined style={{ fontSize: '16px' }} />,  // Adding cross symbol
            duration: 10,
            style: {
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                height: 'calc(100vh - 17vh)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 1rem'
            }}
        >
            <Title level={2}>Your Secure QR Code</Title>
            
            <Card
                style={{ 
                    width: 300, 
                    height: 350,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    position: 'relative'
                }}
                bordered={false}
            >
                {initialLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 36, color: '#1f94ff' }} spin />} />
                    </div>
                ) : (
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {loading && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1,
                                transition: '0.5s'
                            }}>
                                <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: '#1f94ff' }} spin />} />
                            </div>
                        )}
                        <div>
                            <QRCodeSVG 
                                size={256} 
                                value={rawCode || 'loading'} 
                                level="H"
                                includeMargin={true}
                                renderAs="svg"
                                imageSettings={{
                                    excavate: true,
                                    width: 24,
                                    height: 24
                                }}
                            />
                        </div>
                    </div>
                )}
            </Card>
            
            <Space size="large">
                <Button 
                    type="primary" 
                    size="large" 
                    icon={<ReloadOutlined />}
                    onClick={handleCreateNew}
                    loading={loading}
                    style={{ 
                        height: '48px', 
                        borderRadius: '8px',
                        boxShadow: '0 2px 6px rgba(24, 144, 255, 0.2)'
                    }}
                >
                    Create New
                </Button>
                
                <Button 
                    size="large" 
                    icon={<QuestionOutlined />} 
                    onClick={showInfo}
                    style={{ 
                        height: '48px', 
                        borderRadius: '8px'
                    }}
                >
                    Help
                </Button>
            </Space>
        </motion.div>
    );
}