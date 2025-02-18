import classes from "./index.module.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Fade from "../../utility/fade";
import axios from "axios";
import {
    MenuOutlined,
    CloseOutlined,
    UserOutlined,
    ShoppingCartOutlined,
    QrcodeOutlined,
    CalendarOutlined,
    TableOutlined,
    SettingOutlined,
    SolutionOutlined,
    ScanOutlined
} from '@ant-design/icons';
import { Menu, message } from 'antd';
import api from "../..";

// Helper function to create a relative link item
const getItem = (label, link, icon, key) => ({
    key,
    icon,
    label: <Link to={link}>{label}</Link>,
});

// Helper function to create an absolute link item
const getLoginItem = (label, link, icon, key) => ({
    key,
    icon,
    label: <a href={link}>{label}</a>,
});

export default function MenuBar() {
    const [open, setopen] = useState(false);
    const [status, setStatus] = useState(false);

    // console.log(status);
    // Fetch logged-in and admin status and render the menu accordingly
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("requesting status")
                // const response = await axios.get(window.APIROOT + 'api/data/status', { withCredentials: true });
                const response = await api.get('api/data/status');

                console.log(response)
                setStatus(response.data);
            } catch (error) {
                message.error('Failed to fetch data from server');
            }
        }
        fetchData();
    }, []);


    // Prepare menu items dynamically based on the user status
    const items = [
        getLoginItem(status?.loggedIn ? 'Sign out' : 'Sign in', status?.loggedIn ? window.APIROOT +'api/auth/signout' : window.APIROOT +'api/auth/signin', <UserOutlined />, '2'),
        ...(status?.loggedIn ? [
            { type: 'divider' }, // Divider for menu
            getItem('Schedule', '/', <TableOutlined />, '3'),
            getItem('Buy coupons', '/buy-coupons', <ShoppingCartOutlined />, '4'),
            getItem('Purchase history', '/purchase-history', <CalendarOutlined />, '5'),
            getItem('QR code', '/qr-code', <QrcodeOutlined />, '6'),
            ...(status?.admin ? [
                { type: 'divider' }, // Another divider for admin items
                getItem('Admin panel', '/admin', <SettingOutlined />, '7'),
                getItem('Total meals', '/total-meals', <SolutionOutlined />, '8'),
                getItem('Scan QR code', '/scan-qr', <ScanOutlined />, '9'),
            ] : []),
        ] : [])
    ];

    return (
        <>
            <div className={classes.menu}>
                <div className={classes.logo}><span>Mess Portals</span></div>
                <motion.div className={classes.navWrap} animate={{ x: open ? 0 : "-15rem" }} transition={{ duration: 0.3 }}>
                    <Menu className={classes.nav} theme="light" defaultSelectedKeys={['1']} mode="inline" items={items} />
                    <div className={classes.navBtn} onClick={() => setopen(!open)}>
                        <Fade one2Two={open} one={<CloseOutlined />} two={<MenuOutlined />} />
                    </div>
                    <div className={classes.logoCover}></div>
                </motion.div>
            </div>
            <div className={classes.gap} />
        </>
    );
}
