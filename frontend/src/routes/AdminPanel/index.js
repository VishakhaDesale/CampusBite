import { useState, useEffect } from "react";
import { 
  Button, 
  Input, 
  Card, 
  Table, 
  message, 
  Tabs, 
  Tooltip, 
  Popconfirm, 
  Spin, 
  Typography, 
  Space, 
  Badge
} from 'antd';
import { 
  SaveOutlined, 
  EditOutlined, 
  CheckOutlined, 
  CloseOutlined, 
  DollarOutlined, 
  ClockCircleOutlined, 
  MenuOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { motion } from "framer-motion";
import { useMediaQuery } from 'react-responsive';
import api from '../..';
import styles from './index.module.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function AdminPanel() {
  const isMobile = useMediaQuery({ query: '(max-width: 750px)' });
  
  // ====== TIMING AND COST SECTION ======
  const [timingData, setTimingData] = useState([]);
  const [savingTime, setSavingTime] = useState(false);
  const [loadingTime, setLoadingTime] = useState(true);
  const [editingTimeKey, setEditingTimeKey] = useState(null);
  const [editTimeValues, setEditTimeValues] = useState({});

  // ====== MENU SECTION ======
  const [menuData, setMenuData] = useState([]);
  const [savingMenu, setSavingMenu] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [editingCell, setEditingCell] = useState({ day: null, meal: null });
  
  // Handle editing for Time & Cost section
  const startEditingTime = (record) => {
    setEditingTimeKey(record.key);
    setEditTimeValues({
      cost: record.cost,
      time: record.time
    });
  };

  const saveTimeEdit = async (record) => {
    const newData = [...timingData];
    const index = newData.findIndex(item => item.key === record.key);
    
    if (index > -1) {
      newData[index] = { 
        ...newData[index], 
        cost: editTimeValues.cost || newData[index].cost,
        time: editTimeValues.time || newData[index].time
      };
      setTimingData(newData);
      setEditingTimeKey(null);
      
      try {
        setSavingTime(true);
        await api.post('api/admin/setTime', { times: newData });
        message.success('Changes saved successfully');
      } catch (error) {
        message.error('Failed to save changes');
        // Rollback if saving fails
        fetchTime();
      } finally {
        setSavingTime(false);
      }
    }
  };

  const cancelTimeEdit = () => {
    setEditingTimeKey(null);
  };

  // Handle editing for Menu section
  const startEditingMenu = (day, mealType) => {
    setEditingCell({ day, meal: mealType });
  };

  const saveMenuEdit = async (day, mealType, value) => {
    const newMenuData = [...menuData];
    const dayIndex = newMenuData.findIndex(item => item.day === day);
    
    if (dayIndex > -1) {
      newMenuData[dayIndex] = { 
        ...newMenuData[dayIndex], 
        [mealType]: value
      };
      setMenuData(newMenuData);
      setEditingCell({ day: null, meal: null });
      
      try {
        setSavingMenu(true);
        await api.post('api/admin/setMenu', { menus: newMenuData });
        message.success(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} for ${day} updated`);
      } catch (error) {
        message.error('Failed to save changes');
        // Rollback if saving fails
        fetchMenu();
      } finally {
        setSavingMenu(false);
      }
    }
  };

  const cancelMenuEdit = () => {
    setEditingCell({ day: null, meal: null });
  };

  // Fetch Time & Cost data
  const fetchTime = async () => {
    setLoadingTime(true);
    try {
      let response = await api.get('api/data/time');
      
      // Add key property for antd Table
      const dataWithKeys = response.data.map((item, index) => ({
        ...item,
        key: index.toString()
      }));
      
      setTimingData(dataWithKeys);
    } catch (error) {
      message.error('Failed to fetch timing data');
    } finally {
      setLoadingTime(false);
    }
  };

  // Fetch Menu data
  const fetchMenu = async () => {
    setLoadingMenu(true);
    try {
      const response = await api.get('api/data/menu');
      setMenuData(response.data);
    } catch (error) {
      message.error('Failed to fetch menu data');
    } finally {
      setLoadingMenu(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchTime();
    fetchMenu();
  }, []);

  // Save all Time & Cost changes
  const saveAllTimeChanges = async () => {
    setSavingTime(true);
    try {
      await api.post('api/admin/setTime', { times: timingData });
      message.success('All changes saved successfully');
    } catch (error) {
      message.error('Failed to save changes');
    } finally {
      setSavingTime(false);
    }
  };

  // Save all Menu changes
  const saveAllMenuChanges = async () => {
    setSavingMenu(true);
    try {
      await api.post('api/admin/setMenu', { menus: menuData });
      message.success('All menu changes saved successfully');
    } catch (error) {
      message.error('Failed to save changes');
    } finally {
      setSavingMenu(false);
    }
  };

  // Time & Cost columns configuration
  const timingColumns = [
    {
      title: 'Meal',
      dataIndex: 'meal',
      key: 'meal',
      render: (text) => (
        <Space>
          {text === 'Breakfast' && <ClockCircleOutlined style={{ color: '#1890ff' }} />}
          {text === 'Lunch' && <ClockCircleOutlined style={{ color: '#52c41a' }} />}
          {text === 'Dinner' && <ClockCircleOutlined style={{ color: '#722ed1' }} />}
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: () => (
        <Space>
          <DollarOutlined />
          <span>Price (Rs)</span>
        </Space>
      ),
      dataIndex: 'cost',
      key: 'cost',
      width: 150,
      render: (text, record) => {
        const editing = record.key === editingTimeKey;
        return editing ? (
          <Input
            value={editTimeValues.cost}
            onChange={(e) => setEditTimeValues({ ...editTimeValues, cost: e.target.value })}
            onPressEnter={() => saveTimeEdit(record)}
            suffix="Rs"
          />
        ) : (
          <Space>
            <Text>{text}</Text>
            <Text type="secondary">Rs</Text>
          </Space>
        );
      }
    },
    {
      title: () => (
        <Space>
          <ClockCircleOutlined />
          <span>Serving Time</span>
        </Space>
      ),
      dataIndex: 'time',
      key: 'time',
      width: 200,
      render: (text, record) => {
        const editing = record.key === editingTimeKey;
        return editing ? (
          <Input
            value={editTimeValues.time}
            onChange={(e) => setEditTimeValues({ ...editTimeValues, time: e.target.value })}
            onPressEnter={() => saveTimeEdit(record)}
          />
        ) : (
          <Text>{text}</Text>
        );
      }
    },
    {
      title: 'Actions',
      key: 'action',
      width: 120,
      render: (_, record) => {
        const editing = record.key === editingTimeKey;
        return editing ? (
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              size="small"
              onClick={() => saveTimeEdit(record)}
            />
            <Button
              danger
              icon={<CloseOutlined />}
              size="small"
              onClick={cancelTimeEdit}
            />
          </Space>
        ) : (
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => startEditingTime(record)}
          >
            Edit
          </Button>
        );
      }
    }
  ];

  // Render meal menu for a specific day
  const renderDayMenu = (day) => {
    const dayData = menuData.find(item => item.day === day);
    if (!dayData) return null;

    const mealTypes = ['breakfast', 'lunch', 'dinner'];
    
    return (
      <Card 
        title={day.charAt(0).toUpperCase() + day.slice(1)} 
        className={styles.dayCard}
        size="small"
        bordered
      >
        {mealTypes.map(mealType => {
          const isEditing = editingCell.day === day && editingCell.meal === mealType;
          const mealValue = dayData[mealType];
          
          return (
            <div key={mealType} className={styles.mealRow}>
              <div className={styles.mealType}>
                {mealType === 'breakfast' && <Badge color="#1890ff" />}
                {mealType === 'lunch' && <Badge color="#52c41a" />}
                {mealType === 'dinner' && <Badge color="#722ed1" />}
                <Text strong style={{ textTransform: 'capitalize' }}>{mealType}</Text>
              </div>
              
              <div className={styles.mealContent}>
                {isEditing ? (
                  <div className={styles.editActions}>
                    <Input
                      autoFocus
                      defaultValue={mealValue}
                      onPressEnter={(e) => saveMenuEdit(day, mealType, e.target.value)}
                      className={styles.mealInput}
                    />
                    <Space>
                      <Button
                        type="primary"
                        size="small"
                        icon={<CheckOutlined />}
                        onClick={(e) => {
                          const inputValue = e.target.parentNode.parentNode.previousSibling.value;
                          saveMenuEdit(day, mealType, inputValue);
                        }}
                      />
                      <Button
                        danger
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={cancelMenuEdit}
                      />
                    </Space>
                  </div>
                ) : (
                  <div className={styles.viewMode}>
                    <Text>{mealValue}</Text>
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => startEditingMenu(day, mealType)}
                      size="small"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </Card>
    );
  };

  return (
    <div className={styles.adminContainer}>
      <Tabs defaultActiveKey="menu" type="card">
        <TabPane 
          tab={
            <span>
              <MenuOutlined /> Menu Management
            </span>
          } 
          key="menu"
        >
          <motion.div 
            layout 
            className={styles.adminSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.sectionHeader}>
              <Title level={4}>Weekly Menu</Title>
              <Tooltip title="Save all menu changes">
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={savingMenu}
                  onClick={saveAllMenuChanges}
                >
                  Save All Changes
                </Button>
              </Tooltip>
            </div>
            
            {loadingMenu ? (
              <div className={styles.loadingContainer}>
                <Spin size="large" />
              </div>
            ) : (
              <div className={styles.menuGrid}>
                {menuData.map(item => renderDayMenu(item.day))}
              </div>
            )}
          </motion.div>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <DollarOutlined /> Pricing & Timing
            </span>
          } 
          key="timing"
        >
          <motion.div 
            layout 
            className={styles.adminSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.sectionHeader}>
              <Title level={4}>Meal Pricing & Serving Times</Title>
              <Tooltip title="Save all time and price changes">
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={savingTime}
                  onClick={saveAllTimeChanges}
                >
                  Save All Changes
                </Button>
              </Tooltip>
            </div>
            
            {loadingTime ? (
              <div className={styles.loadingContainer}>
                <Spin size="large" />
              </div>
            ) : (
              <Table
                columns={timingColumns}
                dataSource={timingData}
                pagination={false}
                rowClassName={styles.tableRow}
                bordered
              />
            )}
          </motion.div>
        </TabPane>
      </Tabs>
    </div>
  );
}