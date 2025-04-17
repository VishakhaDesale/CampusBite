import classes from './index.module.css';
import { Table } from 'antd';

export default function WeekMenu(props) {
    const { menu, mobile, highlight, loading } = props;

    const renderTypeCell = (text) => ({
        props: { style: { background: "#FAFAFA" } },
        children: <span style={{ fontWeight: 500, textTransform: "capitalize" }}>{text}</span>,
    });

    const renderMealCell = (text, selected) => ({
        props: highlight
            ? {
                style: {
                    background: selected ? "#ceface" : "unset",
                    color: selected ? "unset" : "lightgrey"
                }
            }
            : {},
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Renders a text element with specific styles.
 *

/*******  9fca56a8-6eb8-4b11-abb3-8e165b2ef31f  *******/        children: <span>{text}</span>,
    });

    if (mobile) {
        return menu.map((e, index) => (
            <Table
                key={e.day || index}
                loading={loading}
                className={classes.table}
                columns={[
                    {
                        title: e.day && e.day.charAt(0).toUpperCase() + e.day.substring(1),
                        dataIndex: 'Type',
                        key: 'Type',
                        colSpan: 2,
                        width: 50,
                        render: (text) => renderTypeCell(text)
                    },
                    {
                        title: '',
                        dataIndex: 'Meal',
                        key: 'Meal',
                        colSpan: 0,
                        width: 300,
                        render: (text, record) => renderMealCell(text, record.selected)
                    },
                ]}
                dataSource={[
                    {
                        key: `${e.day || index}-breakfast`,
                        Type: 'Breakfast',
                        Meal: highlight ? e.breakfast.text : e.breakfast,
                        selected: e.breakfast.selected
                    },
                    {
                        key: `${e.day || index}-lunch`,
                        Type: 'Lunch',
                        Meal: highlight ? e.lunch.text : e.lunch,
                        selected: e.lunch.selected
                    },
                    {
                        key: `${e.day || index}-dinner`,
                        Type: 'Dinner',
                        Meal: highlight ? e.dinner.text : e.dinner,
                        selected: e.dinner.selected
                    },
                ]}
                pagination={false}
                bordered
            />
        ));
    } else {
        return (
            <Table
                loading={loading}
                className={classes.table}
                columns={[
                    {
                        title: 'Day',
                        dataIndex: 'day',
                        key: 'day',
                        render: (text) => renderTypeCell(text)
                    },
                    {
                        title: 'Breakfast',
                        dataIndex: 'breakfast',
                        key: 'breakfast',
                        render: (text, record) => renderMealCell(text, record.selected.breakfast)
                    },
                    {
                        title: 'Lunch',
                        dataIndex: 'lunch',
                        key: 'lunch',
                        render: (text, record) => renderMealCell(text, record.selected.lunch)
                    },
                    {
                        title: 'Dinner',
                        dataIndex: 'dinner',
                        key: 'dinner',
                        render: (text, record) => renderMealCell(text, record.selected.dinner)
                    },
                ]}
                dataSource={menu.map((e, i) => ({
                    key: i,
                    day: e.day,
                    breakfast: highlight ? e.breakfast.text : e.breakfast,
                    lunch: highlight ? e.lunch.text : e.lunch,
                    dinner: highlight ? e.dinner.text : e.dinner,
                    selected: {
                        breakfast: e.breakfast.selected,
                        lunch: e.lunch.selected,
                        dinner: e.dinner.selected
                    },
                }))}
                pagination={false}
                bordered
            />
        );
    }
}
