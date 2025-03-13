/* eslint-disable no-unused-vars */
import classes from "./index.module.css";
import { useState, useEffect } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { Radio, Card, Button, message } from "antd";
import Fade from "../../utility/fade";
import {
  CloseSquareOutlined,
  CheckSquareOutlined,
  ReloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import api from "../..";

export default function ScanQRPage() {
  const [data, setData] = useState();
  const [type, setType] = useState(null);
  const [valid, setValid] = useState(null);
  const [videoElement, setVideoElement] = useState(null);

  const checkCoupon = async (postData) => {
    try {
      const response = await api.post("api/user/checkCoupon", postData);
      setValid(response.data);
    } catch (error) {
      message.error("Failed to verify coupon");
      setData(null);
    }
  };

  useEffect(() => {
    if (!videoElement) return;

    let codeReader = new BrowserQRCodeReader();
    // const codeReader = new BrowserQRCodeReader();
    let timer;
    console.log("QR code")
    const decode = async () => {
      try {
        const result = await codeReader.decodeFromVideoDevice(
          undefined,
          videoElement,
          (result) => {
            if (result) {
              setData(result.text);
              console.log(result)
              codeReader.reset();
            }
          }
        );
      } catch (error) {
        console.error("QR Scanner Error:", error);
      }
    };

    decode();
    // return () => codeReader.reset();
    // return () => codeReader.stopContinuousScan();
    codeReader = null;
    return () => codeReader;
  }, [videoElement]);

  useEffect(() => {
    if (!data) return;
    const secret = data.substring(0, 4);
    const email = data.substring(4);
    const day = new Intl.DateTimeFormat("en-US", { weekday: "long" })
      .format(new Date())
      .toLowerCase();
    
    checkCoupon({ secret, email, day, type });
  }, [data, type]);

  return (
    <div className={classes.container}>
      <video 
        ref={setVideoElement} 
        className={classes.scanner}
        style={{ width: "100%", height: "auto" }}
      />
      
      <div className={classes.controls}>
        <Card className={classes.card}>
          <div className={classes.radioGroup}>
            <Radio.Group
              buttonStyle="solid"
              onChange={(e) => setType(e.target.value)}
            >
              <Radio.Button value="breakfast">Breakfast</Radio.Button>
              <Radio.Button value="lunch">Lunch</Radio.Button>
              <Radio.Button value="dinner">Dinner</Radio.Button>
            </Radio.Group>
          </div>

          <h1>{type ? `Scan QR Code for ${type}` : "Select a meal type"}</h1>

          <motion.div layout className={classes.status}>
            {type && (
              <Fade
                one2Two={valid === null}
                one={<LoadingOutlined className={classes.loading} />}
                two={
                  valid ? (
                    <CheckSquareOutlined className={classes.valid} />
                  ) : (
                    <CloseSquareOutlined className={classes.invalid} />
                  )
                }
              />
            )}
          </motion.div>

          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => {
              setData(null);
              setValid(null);
            }}
            disabled={!type}
          >
            Scan New QR
          </Button>
        </Card>
      </div>
    </div>
  );
}