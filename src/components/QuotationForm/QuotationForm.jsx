import React, { Component, useState } from 'react';
import logo from "../../assets/image/logo.png";
import "./QuotationForm.scss";
import TableHeader from '../TableHeader/TableHeader';

class QuotationForm extends Component {
  constructor() {
    super();
    this.state = {
      selectedSupplier: '',
      products: [],
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      date: this.getCurrentDate(),
      tables: [],
    };
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
      <div className="quotation-form">
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
              onChange={(e) => this.setState({ selectedSupplier: e.target.value })}
              className="small-combobox"
            >
              <option value="">Chọn thương hiệu nhà cung cấp</option>
              <option value="supplier1">Nhà cung cấp 1</option>
              <option value="supplier2">Nhà cung cấp 2</option>
              <option value="supplier3">Nhà cung cấp 3</option>
              <option value="supplier4">Nhà cung cấp 4</option>
            </select>
          </div>
        </div>

        <div className="price-table">
            <TableHeader/>
        </div>
      </div>
    );
  }
}

export default QuotationForm;
