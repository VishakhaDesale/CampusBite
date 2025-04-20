import React, { useEffect, useRef, useState } from "react";
import { message } from "antd";
import { createOrder } from "../routes/Buy";

const UPIPayment = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [cost, setCost] = useState(null);
  const hasProcessed = useRef(false); // 🚨 Guard to prevent multiple runs

  const upiLink = process.env.REACT_APP_UPILINK;
  const linkLast = "&cu=INR";

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobile = /android|iphone|ipad|mobile/i.test(userAgent.toLowerCase());
    setIsMobile(mobile);

    let storedCost = JSON.parse(localStorage.getItem("cost") || 0);
    setCost(storedCost);

    if (mobile) {
      window.location.href = upiLink;
    }

    const processOrder = async () => {
      // if (hasProcessed.current) return; // 🛑 prevent multiple execution
      // hasProcessed.current = true;

      // Guard that persists even across re-mounts
      if (localStorage.getItem("orderProcessed") === "true") return;
      localStorage.setItem("orderProcessed", "true");
      // let storedCost = JSON.parse(localStorage.getItem("cost") || 0);
      // setCost(storedCost);

      try {
        const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));

        if (pendingOrder) {
          await createOrder(pendingOrder);
          // message.success("Order created successfully!");
          localStorage.removeItem("pendingOrder");
          localStorage.removeItem("orderProcessed");
          
          setTimeout(() => {
            message.success("Order created successfully!");
          }, 2000); // 2-second delay
          
          setTimeout(() => {
            localStorage.removeItem("cost");
            window.location.href = "/schedule";
          }, 5000); // 5-second delay
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
          <h2>Scan to Pay {cost ? `₹${cost}` : ""}</h2>

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
              upiLink + cost + linkLast
            )}&size=200x200`}
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
