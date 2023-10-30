import React, { useRef,useState  } from 'react';
import QuotationForm from './components/QuotationForm/QuotationForm';
import generatePDF, { Resolution, Margin, Options } from 'react-to-pdf';

const options: Options = {
  filename: `lanha-baogia-${new Date().toLocaleDateString()}.pdf`,
  method: 'save',
  resolution: Resolution.HIGH,
  page: {
    margin: Margin.NONE,
    format: 'a4',
    orientation: 'landscape',
  },
  // canvas: {
  //   mimeType: "image/png",
  //   qualityRatio: 1,
  // },
  // overrides: {
  //   pdf: {
  //     compress: true,
  //   },
  //   canvas: {
  //     useCORS: true,
  //   },
  // },
};

function App() {
  const pdfRef = useRef(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const openPDF = (element) => {
    if (isFormValid) {
      generatePDF(() => element, options);
    } else {
      alert("Vui lòng điền đầy đủ thông tin trước khi xuất PDF.");
    }
  };

  return (
    <div className="App">
      <div ref={pdfRef}>
      <QuotationForm onFormValidationChange={setIsFormValid} />
      </div>
      <button
        onClick={() => openPDF(pdfRef.current)}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          zIndex: 1,
          background: '#ff9c04',  // Màu nền là màu vàng
          color: 'white',         // Màu chữ là màu trắng
          borderRadius: '50%',     // Bo tròn
          padding: '10px 20px',    // Điều chỉnh kích thước
          border: 'none',         // Loại bỏ đường viền
          cursor: 'pointer', // Đảm bảo nút hiển thị trên nội dung
        }}
      >
        Xuất PDF
      </button>
    </div>
  );
}

export default App;
