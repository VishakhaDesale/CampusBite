/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Button, message, Card, Checkbox, Badge, Spin, Typography, Tabs, Tooltip, Empty } from 'antd';
import { ShoppingCartOutlined, CheckCircleOutlined, InfoCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import api from '../..';
import classes from './index.module.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const dayToNum = { 
    "monday": 0, "tuesday": 1, "wednesday": 2, 
    "thursday": 3, "friday": 4, "saturday": 5, "sunday": 6 
};

// Helper function to capitalize first letter
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Custom icon for meal types
const MealIcon = ({ type }) => {
  const icons = {
    breakfast: '🍳',
    lunch: '🍲',
    dinner: '🍽️'
  };
  return <span className={classes.mealIcon}>{icons[type]}</span>;
};

async function createOrder(selected) {
    try {
        const response = await api.post('api/user/createOrder', { selected });
        return response.data;
    } catch (error) {
        message.error('Failed to create order');
        throw error;
    }
}

function MealCard({ dayData, selected, setSelected, loading }) {
    const handleMealSelection = (meal, checked) => {
        setSelected(prev => ({
            ...prev,
            [dayData.day]: {
                ...prev[dayData.day],
                [meal]: checked
            }
        }));
    };

    const getMealTime = (meal) => {
        const times = {
            breakfast: '08:00 AM',
            lunch: '01:00 PM',
            dinner: '08:00 PM'
        };
        return times[meal];
    };

    return (
        <Card 
            className={classes.dayCard}
            bordered={true}
            title={
                <div className={classes.dayHeader}>
                    <CalendarOutlined className={classes.calendarIcon} />
                    <span>{capitalize(dayData.day)}</span>
                </div>
            }
            headStyle={{ backgroundColor: '#f9f9f9' }}
            bodyStyle={{ padding: '12px' }}
        >
            <Spin spinning={loading}>
                {['breakfast', 'lunch', 'dinner'].map(meal => (
                    <motion.div 
                        key={meal}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: ['breakfast', 'lunch', 'dinner'].indexOf(meal) * 0.1 }}
                    >
                        <Card 
                            className={`${classes.mealItem} ${selected[dayData.day][meal] ? classes.selectedMeal : ''}`}
                            size="small"
                            hoverable
                            onClick={() => handleMealSelection(meal, !selected[dayData.day][meal])}
                        >
                            <div className={classes.mealHeader}>
                                <div className={classes.mealTitleBlock}>
                                    <MealIcon type={meal} />
                                    <Text strong className={classes.mealType}>{capitalize(meal)}</Text>
                                    <Text type="secondary" className={classes.mealTime}>
                                        {getMealTime(meal)}
                                    </Text>
                                </div>
                                <Badge 
                                    count={`₹${dayData[meal].cost}`} 
                                    className={classes.priceBadge}
                                    style={{ backgroundColor: '#ff7f50' }}
                                />
                            </div>
                            
                            <div className={classes.menuText}>
                                {dayData[meal].text || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Menu not available" />}
                            </div>
                            
                            <div className={classes.mealFooter}>
                                <Checkbox 
                                    checked={selected[dayData.day][meal]}
                                    onChange={(e) => e.stopPropagation()}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMealSelection(meal, !selected[dayData.day][meal]);
                                    }}
                                    className={classes.mealCheckbox}
                                >
                                    Select
                                </Checkbox>
                                
                                <Tooltip title="Click to select this meal">
                                    <InfoCircleOutlined className={classes.infoIcon} />
                                </Tooltip>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </Spin>
        </Card>
    );
}

function OrderSummary({ selected, loading, cost, setBought, menu }) {
    const totalMeals = Object.values(selected).reduce((acc, dayMeals) => 
        acc + Object.values(dayMeals).filter(Boolean).length, 0);
    
    const selectedMealsList = [];
    Object.entries(selected).forEach(([day, meals]) => {
        Object.entries(meals).forEach(([meal, isSelected]) => {
            if (isSelected) {
                const dayIndex = dayToNum[day];
                selectedMealsList.push({
                    day: capitalize(day),
                    meal: capitalize(meal),
                    cost: menu[dayIndex][meal].cost
                });
            }
        });
    });

    const handlePayment = async () => {
        try {
            await createOrder(selected);
            message.success("Order created successfully!");
            setBought(true);
        } catch (error) {
            message.error("Failed to create order");
        }
    };

    return (
        <Card className={classes.summaryCard}>
            <div className={classes.summaryHeader}>
                <Title level={4}>Order Summary</Title>
                <Badge 
                    count={totalMeals} 
                    showZero 
                    overflowCount={99}
                    style={{ backgroundColor: totalMeals ? '#52c41a' : '#d9d9d9' }}
                >
                    <Text>Selected Meals</Text>
                </Badge>
            </div>

            <div className={classes.mealSummaryList}>
                {selectedMealsList.length > 0 ? (
                    selectedMealsList.map((item, index) => (
                        <div key={index} className={classes.summaryItem}>
                            <Text>{item.day} - {item.meal}</Text>
                            <Text type="secondary">₹{item.cost}</Text>
                        </div>
                    ))
                ) : (
                    <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE} 
                        description="No meals selected yet" 
                        className={classes.emptySelection}
                    />
                )}
            </div>

            <div className={classes.summaryFooter}>
                <div className={classes.totalCost}>
                    <Text strong>Total Cost:</Text>
                    <Title level={3} className={classes.costAmount}>₹{cost}</Title>
                </div>
                
                <Button 
                    disabled={loading || !cost} 
                    onClick={handlePayment} 
                    className={classes.buyButton} 
                    type="primary" 
                    size="large" 
                    icon={<ShoppingCartOutlined />}
                >
                    Confirm Order
                </Button>
            </div>
        </Card>
    );
}

export default function BuyPage() {
    const [cost, setCost] = useState(0);
    const [loading, setLoading] = useState(true);
    const [bought, setBought] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });
    
    const [menu, setMenu] = useState(Array(7).fill().map((_, i) => ({
        day: Object.keys(dayToNum)[i],
        breakfast: { text: "", cost: "" },
        lunch: { text: "", cost: "" },
        dinner: { text: "", cost: "" },
    })));
    
    const [selected, setSelected] = useState(
        Object.fromEntries(Object.keys(dayToNum).map(day => [
            day, { breakfast: false, lunch: false, dinner: false }
        ]))
    );

    // Calculate cost when selection changes
    useEffect(() => {
        const totalCost = Object.entries(selected).reduce((acc, [day, meals]) => {
            const dayData = menu[dayToNum[day]];
            return acc + Object.entries(meals).reduce((dayAcc, [meal, selected]) => {
                return selected ? dayAcc + (dayData[meal]?.cost || 0) : dayAcc;
            }, 0);
        }, 0);
        setCost(totalCost);
    }, [menu, selected]);

    // Fetch menu and prices
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [menuRes, pricesRes] = await Promise.all([
                    api.get('api/data/menu'),
                    api.get('api/data/time')
                ]);
                
                const mealPrices = pricesRes.data.reduce((acc, { meal, cost }) => 
                    ({ ...acc, [meal]: cost }), {});
                
                const updatedMenu = menuRes.data.map(day => ({
                    ...day,
                    breakfast: { text: day.breakfast, cost: mealPrices.breakfast },
                    lunch: { text: day.lunch, cost: mealPrices.lunch },
                    dinner: { text: day.dinner, cost: mealPrices.dinner }
                }));
                
                setMenu(updatedMenu);
                setLoading(false);
            } catch (error) {
                message.error('Failed to fetch data');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Check existing orders
    useEffect(() => {
        api.get('api/user/boughtNextWeek')
            .then(({ data }) => setBought(data))
            .catch(() => message.error('Failed to check existing orders'));
    }, []);

    // if (bought) {
    //     return (
    //         <div className={classes.orderConfirmedContainer}>
    //             <motion.div
    //                 initial={{ scale: 0.8, opacity: 0 }}
    //                 animate={{ scale: 1, opacity: 1 }}
    //                 transition={{ duration: 0.5 }}
    //             >
    //                 <Card 
    //                     className={classes.orderConfirmedCard}
    //                     title={
    //                         <div className={classes.confirmationHeader}>
    //                             <CheckCircleOutlined className={classes.confirmIcon} />
    //                             <span>Order Confirmed</span>
    //                         </div>
    //                     }
    //                 >
    //                     <Typography.Paragraph>
    //                         Your meals for the next week have been successfully booked.
    //                         You can view your purchase history for details.
    //                     </Typography.Paragraph>
    //                     <Button type="primary">View History</Button>
    //                 </Card>
    //             </motion.div>
    //         </div>
    //     );
    // }

    // Filter days based on active tab
    const getFilteredDays = () => {
        if (activeTab === 'all') return menu;
        if (activeTab === 'weekdays') 
            return menu.filter(day => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day.day));
        if (activeTab === 'weekend') 
            return menu.filter(day => ['saturday', 'sunday'].includes(day.day));
        return menu;
    };

    return (
        <div className={classes.pageContainer}>
            <div className={classes.headerSection}>
                <Title level={2}>Weekly Meal Planner</Title>
                <Text type="secondary">Choose your meals for the upcoming week</Text>
            </div>

            <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                className={classes.menuTabs}
                type="card"
            >
                <TabPane tab="All Days" key="all" />
                <TabPane tab="Weekdays" key="weekdays" />
                <TabPane tab="Weekend" key="weekend" />
            </Tabs>

            <div className={classes.menuLayout}>
                <div className={classes.menuContainer}>
                    {getFilteredDays().map((dayData) => (
                        <MealCard 
                            key={dayData.day}
                            dayData={dayData}
                            selected={selected}
                            setSelected={setSelected}
                            loading={loading}
                        />
                    ))}
                </div>
                
                <div className={classes.orderSummaryContainer}>
                    <OrderSummary 
                        selected={selected}
                        loading={loading}
                        cost={cost}
                        setBought={setBought}
                        menu={menu}
                    />
                </div>
            </div>
        </div>
    );
}