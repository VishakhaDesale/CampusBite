/* eslint-disable no-unused-vars */
import classes from './index.module.css';
import { Table, Button, message, Card } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import api from '../..';

const dayToNum = { 
    "monday": 0, "tuesday": 1, "wednesday": 2, 
    "thursday": 3, "friday": 4, "saturday": 5, "sunday": 6 
};

const columns = [
    { title: 'Meal', dataIndex: 'meal', width: 90 },
    { title: 'Rs', dataIndex: 'cost', width: 50 },
    { title: 'Menu', dataIndex: 'menu' },
];

async function createOrder(selected) {
    try {
        const response = await api.post('api/user/createOrder', { selected });
        return response.data;
    } catch (error) {
        message.error('Failed to create order');
        throw error;
    }
}

function PayButton({ selected, disabled, cost, setBought }) {
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
        <Button 
            disabled={disabled || !cost} 
            onClick={handlePayment} 
            className={classes.buy} 
            type='primary' 
            size='large' 
            icon={<ShoppingCartOutlined />}
        >
            Confirm Order
        </Button>
    );
}

export default function BuyPage() {
    const [cost, setCost] = useState(0);
    const [loading, setLoading] = useState(true);
    const [bought, setBought] = useState(false);
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
    //         <div className={classes.bought}>
    //             <Card title="Order Confirmed" bordered={false} style={{ width: 300 }}>
    //                 Your meals for the next week have been successfully booked.
    //                 You can view your purchase history for details.
    //             </Card>
    //         </div>
    //     );
    // }

    return (
        <div className={classes.buyBody}>
            {menu.map((dayData, index) => (
                <div key={dayData.day}>
                    <h1>{dayData.day}</h1>
                    <Table
                        loading={loading}
                        className={classes.table}
                        pagination={false}
                        rowSelection={{
                            type: 'checkbox',
                            onChange: (_, selectedRows) => {
                                const selections = {
                                    breakfast: selectedRows.some(r => r.key === 'breakfast'),
                                    lunch: selectedRows.some(r => r.key === 'lunch'),
                                    dinner: selectedRows.some(r => r.key === 'dinner')
                                };
                                setSelected(prev => ({
                                    ...prev,
                                    [dayData.day]: selections
                                }));
                            }
                        }}
                        columns={columns}
                        dataSource={[
                            {
                                key: 'breakfast',
                                meal: 'Breakfast',
                                menu: dayData.breakfast.text,
                                cost: dayData.breakfast.cost
                            },
                            {
                                key: 'lunch',
                                meal: 'Lunch',
                                menu: dayData.lunch.text,
                                cost: dayData.lunch.cost
                            },
                            {
                                key: 'dinner',
                                meal: 'Dinner',
                                menu: dayData.dinner.text,
                                cost: dayData.dinner.cost
                            }
                        ]}
                    />
                </div>
            ))}
            <h1>Total Cost: ₹{cost}</h1>
            <PayButton 
                selected={selected} 
                disabled={loading} 
                cost={cost} 
                setBought={setBought} 
            />
        </div>
    );
}