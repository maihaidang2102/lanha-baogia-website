import React, { useRef } from 'react';
import QuotationForm from './components/QuotationForm/QuotationForm';
import generatePDF, { Resolution, Margin, Options } from 'react-to-pdf';

const options: Options = {
  filename: 'trang-web.pdf',
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

  const openPDF = (element) => {
    generatePDF(() => element, options);
  };

  return (
    <div className="App">
      <div ref={pdfRef}>
        <QuotationForm />
      </div>
      <button onClick={() => openPDF(pdfRef.current)}>Xuất PDF</button>
    </div>
  );
}

export default App;
