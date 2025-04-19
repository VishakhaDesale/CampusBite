import React, { useEffect, useRef, useState } from "react";
import { message } from 'antd';
import { createOrder } from "../routes/Buy";

const UPIPayment = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [cost, setCost] = useState(false);
  const hasProcessed = useRef(false); // 🚨 Guard to prevent multiple runs

  const upiLink = process.env.REACT_APP_UPILINK;
  const linkLast = "&cu=INR";

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobile = /android|iphone|ipad|mobile/i.test(userAgent.toLowerCase());
    setIsMobile(mobile);

    if (mobile) {
      window.location.href = upiLink;
    }

    const processOrder = async () => {
      if (hasProcessed.current) return; // 🛑 prevent multiple execution
      hasProcessed.current = true;

      try {
        const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
        const storedCost = JSON.parse(localStorage.getItem('cost'));
        setCost(storedCost);

        if (pendingOrder) {
          await createOrder(pendingOrder);
          message.success("Order created successfully!");
          localStorage.removeItem('pendingOrder');
          localStorage.removeItem('cost');

          setTimeout(() => {
            window.location.href = '/schedule';
          }, 10000); // 10-second delay
        }
      } catch (error) {
        message.error("Failed to create order");
      }
    };

    processOrder();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      {isMobile ? (
        <p>Redirecting to your UPI app...</p>
      ) : (
        <>
          <h2>Scan to Pay {cost}</h2>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiLink+cost+linkLast)}&size=200x200`}
            alt="Scan QR to Pay"
            style={{ margin: "10rem 0", width: "200px" }}
          />
          <p>Use any UPI app (Google Pay, PhonePe, Paytm) to scan and pay.</p>
        </>
      )}
    </div>
  );
};

export default UPIPayment;
