import React, { useRef } from 'react';
import QuotationForm from './components/QuotationForm/QuotationForm';
import './App.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function App() {
  const pdfRef = useRef(null);

  const handleExportPDF = () => {
    const pdf = new jsPDF('landscape', 'px', 'a4'); // Định cấu hình kích thước và hướng theo nhu cầu
  
    html2canvas(pdfRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg');
      pdf.addImage(imgData, 'JPEG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
      pdf.save('trang-web.pdf');
    });
  };
  

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
