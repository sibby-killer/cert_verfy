import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess, onScanError, onClose }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    });

    scanner.render(onScanSuccess, onScanError);

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div className="relative bg-slate-50 p-4 rounded-xl border-2 border-dashed border-slate-200">
      <div id="qr-reader" className="w-full overflow-hidden rounded-lg"></div>
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-500 mb-4">Point your camera at the certificate QR code</p>
        <button 
          onClick={onClose}
          className="text-slate-600 font-medium hover:text-slate-800 underline"
        >
          Cancel Scanning
        </button>
      </div>
      
      {/* Animated Scan Line Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] pointer-events-none">
        <div className="w-full h-1 bg-primary/40 animate-bounce mt-10"></div>
      </div>
    </div>
  );
};

export default QRScanner;
