import React, { useState, useEffect } from 'react';
import logo from "../../assets/image/logo.jpg";
import "./QuotationForm.scss";
import TableHeader from '../TableHeader/TableHeader';
import TableBody from '../TableBody/TableBody';
import jsPDF from 'jspdf';
import { fetchTrademarks } from '../../utils/apiService';
import html2pdf from 'html2pdf.js';
import PromotionTable from '../Promotions/Promotions';
import html2canvas from 'html2canvas';

const QuotationForm = ({ onFormValidationChange }) => {
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [supplierId, setSupplierId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [date, setDate] = useState(getCurrentDate());
  const [tables, setTables] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  function handleFormValidation() {
    const isValid = customerName.trim() !== '' && customerPhone.trim() !== '' && customerAddress.trim() !== '';
    console.log("OOOOOOOOOOO",isValid);
    onFormValidationChange(isValid);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchTrademarks();
        if (data) {
          setSuppliers(data);
        }
      } catch (error) {
        console.error('Lỗi khi truy cập API:', error);
      }
    }

    fetchData();
  }, []);

  function getCurrentDate() {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  function handleDateChange(e) {
    setDate(e.target.value);
  }

  function addTable() {
    const newTable = <TableHeader key={tables.length} />;
    setTables((prevTables) => [...prevTables, newTable]);
  }

  const handleSupplierSelect = (selectedSupplier) => {
    const supplier = suppliers.find((s) => s.name === selectedSupplier);
    const supplierId = supplier ? supplier._id : '';
    setSelectedSupplier(selectedSupplier);
    setSupplierId(supplierId);
    setIsDropdownOpen(false);
  };
  

  return (
    <div className="quotation-form" id='dangpro'>
      <div className="logo">
        <img src={logo} alt="Your Logo" />
      </div>
      <div className="text-container">
        <div className="left-text">
          <div>
            <strong>Email:</strong>
            <span> lanhainfo@gmail.com</span>
          </div>
          <div>
            <strong>Số điện thoại:</strong>
            <span> 0703 937 521</span>
          </div>
          <div>
            <strong>Showroom:</strong>
            <span> KDC Vạn Phúc, QL13, Hiệp Bình Phước, TP.Thủ Đức</span>
          </div>
          <div>
            <strong>Xưởng sản xuất:</strong>
            <span> 10VP, đường C4 (Phạm Hùng), Quận 8</span>
          </div>
        </div>
        <div className="right-text">
          <div>
            <strong>Khách hàng:</strong>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              value={customerName}
              onChange={(e) =>{ setCustomerName(e.target.value);handleFormValidation(); }}
              
            />
          </div>
          <div>
            <strong>Số điện thoại:</strong>
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              value={customerPhone}
              onChange={(e) => {setCustomerPhone(e.target.value);handleFormValidation(); }}
            />
          </div>
          <div>
            <strong>Địa chỉ công trình:</strong>
            <input
              type="text"
              placeholder="Nhập địa chỉ"
              value={customerAddress}
              onChange={(e) => {setCustomerAddress(e.target.value);handleFormValidation(); }}
            />
          </div>
          <div>
            <strong>Ngày soạn báo giá:</strong>
            <input
              type="text"
              value={date}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>
      <div className="center-content">
  <div className="dropdown-container noprint-border">
    <div
      className="dropdown-button noprint-border"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      {selectedSupplier || 'Nhà cung cấp'}
    </div>
    {isDropdownOpen && (
      <div className="dropdown-content">
        {suppliers.map((supplier, index) => (
          <div
            key={index}
            className="dropdown-option"
            onClick={() => handleSupplierSelect(supplier.name)}
          >
            {supplier.name}
          </div>
        ))}
      </div>
    )}
  </div>
</div>
      <TableHeader />
      <TableBody supplierId={supplierId} />
      <div className="note-2">
      <p className="note-text">
        Báo giá trên chỉ mang tính chất tham khảo do chưa có số liệu công trình thực tế. Vui lòng liên hệ sale account qua Fanpage Nội thất Là Nhà:  
        <a href="https://www.facebook.com/noithat.lanha" target="_blank" rel="noopener noreferrer"> https://www.facebook.com/noithat.lanha</a> hoặc hotline/zalo:  
        <a href="https://zalo.me/0703937521" target="_blank" rel="noopener noreferrer"> https://zalo.me/0703937521</a> để được tư vấn đo đạc chính xác nhất.
      </p>
    </div>
    </div>
    
  );
};

export default QuotationForm;
