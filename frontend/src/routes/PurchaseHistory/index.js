import { Button, Spin, message, Tabs, Card, Badge } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { useState, useEffect } from "react";
import { CheckCircleFilled, CalendarOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import api from '../..';
import styles from './index.module.css';

export default function PurchaseHistoryPage() {
  const isMobile = useMediaQuery({ query: '(max-width: 750px)' });
  const [activeWeek, setActiveWeek] = useState("this");
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menuResponse, buyerResponse] = await Promise.all([
          api.get('api/data/menu'),
          api.get('api/user/data')
        ]);

        const formattedData = menuResponse.data.map(r => ({
          day: r.day,
          breakfast: {
            text: r.breakfast,
            selected: buyerResponse.data[activeWeek][r.day].breakfast
          },
          lunch: {
            text: r.lunch,
            selected: buyerResponse.data[activeWeek][r.day].lunch
          },
          dinner: {
            text: r.dinner,
            selected: buyerResponse.data[activeWeek][r.day].dinner
          }
        }));

        setMenu(formattedData);
      } catch (error) {
        message.error('Failed to fetch purchase history');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeWeek]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealTypes = ["breakfast", "lunch", "dinner"];
  const mealLabels = {
    breakfast: "Breakfast",
    lunch: "Lunch", 
    dinner: "Dinner"
  };

  const getMealCount = () => {
    return menu.reduce((count, day) => {
      mealTypes.forEach(mealType => {
        if (day[mealType]?.selected) count++;
      });
      return count;
    }, 0);
  };

  return (
    <div className={styles.purchaseHistoryContainer}>
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>
          <span className={styles.iconWrapper}>
            <CalendarOutlined />
          </span>
          Your Meal Plan
        </h1>
        
        <Badge count={getMealCount()} offset={[10, 0]}>
          <div className={styles.weekToggleWrapper}>
            <Button.Group className={styles.weekToggle}>
              <Button 
                type={activeWeek === "this" ? "primary" : "default"}
                onClick={() => setActiveWeek("this")}
                icon={<LeftOutlined />}
                className={styles.weekToggleButton}
              >
                This Week
              </Button>
              <Button 
                type={activeWeek === "next" ? "primary" : "default"} 
                onClick={() => setActiveWeek("next")}
                className={styles.weekToggleButton}
              >
                Next Week <RightOutlined />
              </Button>
            </Button.Group>
          </div>
        </Badge>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <div className={styles.mealCardsContainer}>
          {days.map(day => {
            const dayData = menu.find(d => d.day.toLowerCase() === day.toLowerCase());
            if (!dayData) return null;
            
            return (
              <Card 
                key={day} 
                title={day} 
                className={styles.dayCard}
                headStyle={{ backgroundColor: '#f7f7f7' }}
              >
                {mealTypes.map(mealType => (
                  <div 
                    key={mealType} 
                    className={`${styles.mealItem} ${dayData[mealType].selected ? styles.selectedMeal : ''}`}
                  >
                    <div className={styles.mealHeader}>
                      {dayData[mealType].selected && (
                        <CheckCircleFilled className={styles.checkIcon} />
                      )}
                      <h3 className={styles.mealTitle}>{mealLabels[mealType]}</h3>
                    </div>
                    <p className={styles.mealText}>{dayData[mealType].text}</p>
                  </div>
                ))}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}