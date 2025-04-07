import { useState, useEffect } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { Radio, Card, Button, message } from "antd";
import { 
  CloseSquareOutlined, 
  CheckSquareOutlined, 
  ReloadOutlined, 
  LoadingOutlined,
  QrcodeOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
import api from "../..";

export default function ScanQRPage() {
  const [data, setData] = useState();
  const [type, setType] = useState(null);
  const [valid, setValid] = useState(null);
  const [videoElement, setVideoElement] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [controls, setControls] = useState(null);

  const checkCoupon = async (postData) => {
    try {
      setScanning(false);
      const response = await api.post("api/user/checkCoupon", postData);
      setValid(response.data);
    } catch (error) {
      message.error("Failed to verify coupon");
      setData(null);
      setScanning(true);
    }
  };

  useEffect(() => {
    if (!videoElement || !scanning) return;

    const codeReader = new BrowserQRCodeReader();
    let controlsRef = null;
    
    const decode = async () => {
      try {
        // Store the controls so we can stop/cleanup properly
        controlsRef = await codeReader.decodeFromVideoDevice(
          undefined,
          videoElement,
          (result) => {
            if (result) {
              setData(result.text);
              
              // Don't call reset - instead let's store the controls
              if (controlsRef) {
                controlsRef.stop();
              }
            }
          }
        );
        setControls(controlsRef);
      } catch (error) {
        console.error("QR Scanner Error:", error);
      }
    };

    decode();
    
    return () => {
      // Clean up properly using the controls
      if (controlsRef) {
        controlsRef.stop();
      }
    };
  }, [videoElement, scanning]);

  useEffect(() => {
    if (!data || !type) return;
    
    const secret = data.substring(0, 4);
    const email = data.substring(4);
    const day = new Intl.DateTimeFormat("en-US", { weekday: "long" })
      .format(new Date())
      .toLowerCase();
    
    checkCoupon({ secret, email, day, type });
  }, [data, type]);

  const resetScan = () => {
    // Stop the current scanner
    if (controls) {
      controls.stop();
    }
    
    setData(null);
    setValid(null);
    setScanning(true);
  };

  const getStatusIcon = () => {
    if (valid === null && scanning) {
      return <QrcodeOutlined style={{ color: '#1890ff', fontSize: '4rem' }} className="animate-pulse" />;
    } else if (valid === null && !scanning) {
      return <LoadingOutlined style={{ color: '#1890ff', fontSize: '4rem' }} spin />;
    } else if (valid) {
      return <CheckSquareOutlined style={{ color: '#52c41a', fontSize: '4rem' }} />;
    } else {
      return <CloseSquareOutlined style={{ color: '#f5222d', fontSize: '4rem' }} />;
    }
  };

  const getStatusMessage = () => {
    if (valid === null && scanning) {
      return "Ready to scan";
    } else if (valid === null && !scanning) {
      return "Processing...";
    } else if (valid) {
      return "Valid Coupon!";
    } else {
      return "Invalid Coupon";
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f0f5ff, #e6f7ff)',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center',
        marginBottom: '1rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1d39c4', marginBottom: '0.5rem' }}>
          Meal QR Scanner
        </h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Scan your QR code to verify your meal coupon
        </p>
      </div>
      
      <div style={{ width: '100%', maxWidth: '500px' }}>
        {/* Camera View */}
        <div style={{
          position: 'relative',
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '1rem',
          background: '#fff'
        }}>
          <div style={{
            opacity: !type ? 0.5 : 1,
            transition: 'opacity 0.3s'
          }}>
            {scanning && (
              <div style={{
                position: 'absolute',
                inset: 0,
                border: '4px solid #1890ff',
                borderRadius: '8px',
                zIndex: 10,
                animation: 'pulse 2s infinite'
              }}></div>
            )}
            <video
              ref={setVideoElement}
              style={{
                width: '100%',
                height: 'auto',
                minHeight: '300px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </div>
          
          {!type && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              fontSize: '1.125rem',
              fontWeight: 600,
              padding: '1rem',
              textAlign: 'center'
            }}>
              Please select a meal type to start scanning
            </div>
          )}
        </div>
        
        {/* Controls */}
        <Card style={{
          width: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <Radio.Group
              buttonStyle="solid"
              onChange={(e) => setType(e.target.value)}
              value={type}
              size="large"
              style={{ width: '100%', display: 'flex' }}
            >
              <Radio.Button value="breakfast" style={{ flex: 1, textAlign: 'center' }}>
                Breakfast
              </Radio.Button>
              <Radio.Button value="lunch" style={{ flex: 1, textAlign: 'center' }}>
                Lunch
              </Radio.Button>
              <Radio.Button value="dinner" style={{ flex: 1, textAlign: 'center' }}>
                Dinner
              </Radio.Button>
            </Radio.Group>
          </div>
          
          <motion.div 
            layout 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
          >
            {getStatusIcon()}
            <p style={{
              marginTop: '0.5rem',
              fontSize: '1.125rem',
              fontWeight: 500,
              color: '#333'
            }}>
              {getStatusMessage()}
            </p>
            
            {valid !== null && (
              <p style={{
                fontSize: '0.875rem',
                color: '#666',
                marginTop: '0.5rem',
                textAlign: 'center'
              }}>
                {valid ? "Your meal has been successfully verified" : "Please try again or contact support"}
              </p>
            )}
          </motion.div>
          
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={resetScan}
            disabled={!type}
            size="large"
            style={{
              width: '100%',
              background: '#1890ff',
              borderColor: '#1890ff'
            }}
          >
            Scan New QR
          </Button>
        </Card>
      </div>
      
      <div style={{
        textAlign: 'center',
        color: '#666',
        fontSize: '0.875rem',
        marginTop: '1rem'
      }}>
        Position QR code within frame for scanning
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}