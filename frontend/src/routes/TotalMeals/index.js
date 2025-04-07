import { useState, useEffect } from 'react';
import { 
  Button, 
  Space, 
  message, 
  Card, 
  Spin, 
  Tabs, 
  Empty, 
  Badge, 
  Tooltip,
  Statistic,
  Row,
  Col,
  Progress
} from 'antd';
import { 
  EditOutlined, 
  ReloadOutlined, 
  CalendarOutlined, 
  BarChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import api from '../..';
import WeekMenu from '../../components/WeekMenu';
import classes from './index.module.css';

export default function TotalMealsPage() {
    const [activeWeek, setActiveWeek] = useState("this");
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [activeTab, setActiveTab] = useState('table');

    const fetchMenu = async (week = activeWeek) => {
        setLoading(true);
        try {
            const response = await api.post('api/admin/meals', { week });
            setMenu(response.data);
            setLastUpdated(new Date());
            setLoading(false);
        } catch (error) {
            message.error('Failed to fetch menu from server');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu(activeWeek);
    }, [activeWeek]);

    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    const handleEditMeals = () => {
        message.info('Edit functionality will be implemented here');
    };

    // Calculate meal statistics
    const calculateStats = () => {
        if (!menu || menu.length === 0) return null;
        
        const stats = {
            totalMeals: 0,
            breakfast: 0,
            lunch: 0,
            dinner: 0,
            days: menu.length
        };

        menu.forEach(day => {
            stats.totalMeals += day.totalMeals || 0;
            stats.breakfast += day.breakfastCount || 0;
            stats.lunch += day.lunchCount || 0;
            stats.dinner += day.dinnerCount || 0;
        });

        return stats;
    };

    const stats = calculateStats();

    const renderStats = () => {
        if (!stats) return null;

        return (
            <div className={classes.statsContainer}>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card className={classes.statCard}>
                            <Statistic 
                                title="Total Meals" 
                                value={stats.totalMeals} 
                                prefix={<BarChartOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className={classes.statCard}>
                            <Statistic 
                                title="Breakfast" 
                                value={stats.breakfast} 
                                prefix="🍳"
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className={classes.statCard}>
                            <Statistic 
                                title="Lunch" 
                                value={stats.lunch} 
                                prefix="🍲"
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className={classes.statCard}>
                            <Statistic 
                                title="Dinner" 
                                value={stats.dinner} 
                                prefix="🍛"
                            />
                        </Card>
                    </Col>
                </Row>

                <Card title="Meal Distribution" className={classes.distributionCard}>
                    <div className={classes.progressContainer}>
                        <div className={classes.progressItem}>
                            <span>Breakfast</span>
                            <Progress 
                                percent={Math.round((stats.breakfast / stats.totalMeals) * 100)} 
                                strokeColor="#8884d8"
                                format={percent => `${percent}%`}
                            />
                        </div>
                        <div className={classes.progressItem}>
                            <span>Lunch</span>
                            <Progress 
                                percent={Math.round((stats.lunch / stats.totalMeals) * 100)} 
                                strokeColor="#82ca9d"
                                format={percent => `${percent}%`}
                            />
                        </div>
                        <div className={classes.progressItem}>
                            <span>Dinner</span>
                            <Progress 
                                percent={Math.round((stats.dinner / stats.totalMeals) * 100)} 
                                strokeColor="#ffc658"
                                format={percent => `${percent}%`}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    const renderContent = (week) => {
        if (loading && activeWeek === week) {
            return (
                <div className={classes.loadingContainer}>
                    <Spin size="large" tip="Loading menu..." />
                </div>
            );
        }
        
        if (menu.length === 0) {
            return <Empty description={`No meals scheduled for ${week === 'this' ? 'this' : 'next'} week`} />;
        }

        return (
            <>
                <WeekMenu menu={menu} mobile={false} />
                {renderStats()}
            </>
        );
    };

    const items = [
        {
            key: 'this',
            label: (
                <span>
                    <CalendarOutlined /> This Week
                </span>
            ),
            children: (
                <Card 
                    className={classes.menuCard}
                    title={
                        <div className={classes.cardTitle}>
                            <span className={classes.weekTitle}>
                                <Badge status="processing" text="Current Week Menu" />
                            </span>
                        </div>
                    }
                    extra={
                        <Space>
                            
                            <Tooltip title="Refresh data">
                                <Button 
                                    icon={<ReloadOutlined />} 
                                    onClick={() => fetchMenu("this")}
                                    loading={loading && activeWeek === "this"}
                                >
                                    Refresh
                                </Button>
                            </Tooltip>
                        </Space>
                    }
                >
                    {renderContent('this')}
                </Card>
            )
        },
       
    ];

    return (
        <div className={classes.pageContainer}>
            <h1 className={classes.simpleTitleHeader}>Meal Management Dashboard</h1>
            
            <Tabs
                activeKey={activeWeek}
                items={items}
                onChange={setActiveWeek}
                className={classes.tabs}
                tabBarStyle={{ marginBottom: '16px' }}
            />
            
            {lastUpdated && (
                <div className={classes.lastUpdated}>
                    Last updated: {formatDate(lastUpdated)}
                </div>
            )}
        </div>
    );
}