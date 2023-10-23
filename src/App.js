import React, { useRef } from 'react';
import QuotationForm from './components/QuotationForm/QuotationForm';
import './App.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function App() {
  const pdfRef = useRef(null);

  function handleExportPDF() {
    const pdf = new jsPDF('landscape', 'px', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
  
    html2canvas(pdfRef.current, {
  scale: 2,
  useCORS: true, // Cho phép truy cập các nguồn từ miền khác
  allowTaint: true, // Cho phép tải tất cả nguồn tương tác
}).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
      pdf.save('trang-web.pdf');
    });
  }
  
  

  return (
    <div className="App">
      <div ref={pdfRef}>
        <QuotationForm />
      </div>
      <button onClick={handleExportPDF}>Xuất PDF</button>
    </div>
  );
}

export default App;
