import React, { Component, useState } from 'react';
import logo from "../../assets/image/logo.png";
import "./QuotationForm.scss";
import TableHeader from '../TableHeader/TableHeader';
import TableBody from '../TableBody/TableBody';
import jsPDF from 'jspdf';
import { fetchTrademarks } from '../../utils/apiService';
import html2pdf from 'html2pdf.js';
import PromotionTable from '../Promotions/Promotions';
import html2canvas from 'html2canvas';


class QuotationForm extends Component {
  constructor() {
    super();
    this.state = {
      selectedSupplier: '',
      products: [],
      supplierId: '',
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      date: this.getCurrentDate(),
      tables: [],
      suppliers: [],
    };
  }

  // printSupplierId = () => {
  //   alert("ID của nhà cung cấp: " + this.state.supplierId);
  // };

  async componentDidMount() {
    try {
      const data = await fetchTrademarks();
      if (data) {
        // Lấy danh sách tên thương hiệu từ response
        this.setState({ suppliers: data });
      }
    } catch (error) {
      console.error('Lỗi khi truy cập API:', error);
    }
  }

  getCurrentDate = () => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  handleDateChange = (e) => {
    this.setState({ date: e.target.value });
  };
  addTable = () => {
    const newTable = <TableHeader key={this.state.tables.length} />;
    this.setState((prevState) => ({ tables: [...prevState.tables, newTable] }));
  };

  render() {
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
                value={this.state.customerName}
                onChange={(e) => this.setState({ customerName: e.target.value })}
              />
            </div>
            <div>
              <strong>Số điện thoại:</strong>
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                value={this.state.customerPhone}
                onChange={(e) => this.setState({ customerPhone: e.target.value })}
              />
            </div>
            <div>
              <strong>Địa chỉ công trình:</strong>
              <input
                type="text"
                placeholder="Nhập địa chỉ"
                value={this.state.customerAddress}
                onChange={(e) => this.setState({ customerAddress: e.target.value })}
              />
            </div>
            <div>
              <strong>Ngày soạn báo giá:</strong>
              <input
                type="text"
                value={this.state.date}
                onChange={this.handleDateChange}
              />
            </div>
          </div>
        </div>
        <div className="center-content">
          <div className="small-combobox-container">
          <select
              value={this.state.selectedSupplier}
              onChange={(e) => {
                const selectedSupplier = e.target.value;
                const supplier = this.state.suppliers.find((s) => s.name === selectedSupplier);
                const supplierId = supplier ? supplier._id : '';
                this.setState({ selectedSupplier, supplierId }, this.printSupplierId);
              }}
              className="small-combobox"
            >
              <option value="">-- Chọn thương hiệu nhà cung cấp --</option>
              {this.state.suppliers.map((supplier, index) => (
                <option key={index} value={supplier.name}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
        </div>

          <TableHeader />
          <TableBody supplierId={this.state.supplierId} />
          <PromotionTable/>
      </div>
    );
  }
}

export default QuotationForm;
