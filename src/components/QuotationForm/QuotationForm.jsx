import React, { useState, useEffect } from 'react';
import logo from "../../assets/image/logo.png";
import "./QuotationForm.scss";
import TableHeader from '../TableHeader/TableHeader';
import TableBody from '../TableBody/TableBody';
import jsPDF from 'jspdf';
import { fetchTrademarks } from '../../utils/apiService';
import html2pdf from 'html2pdf.js';
import PromotionTable from '../Promotions/Promotions';
import html2canvas from 'html2canvas';

const QuotationForm = () => {
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
            <span> 081 2663 325</span>
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
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div>
            <strong>Số điện thoại:</strong>
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>
          <div>
            <strong>Địa chỉ công trình:</strong>
            <input
              type="text"
              placeholder="Nhập địa chỉ"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
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
  <div className="dropdown-container">
    <div
      className="dropdown-button"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      {selectedSupplier || 'Chọn thương hiệu nhà cung cấp'}
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
    </div>
  );
};

export default QuotationForm;
