import React from 'react';
import './Promotions.scss';

const PromotionTable = () => {
  return (
    <div className="promotion-table">
      <table>
        <thead>
          <tr>
            <th colSpan="4">CHƯƠNG TRÌNH KHUYẾN MÃI</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td>
              <div className="upper-part">KHUYẾN MÃI BẠC</div>
              <div className="lower-part">Thời gian nhận nhà dưới 01 tháng</div>
            </td>
            <td>
              <div className="upper-part">KHUYẾN MÃI VÀNG</div>
              <div className="lower-part">Thời gian nhận nhà sau 01 tháng - dưới 02 tháng</div>
            </td>
            <td>
              <div className="upper-part">KHUYẾN MÃI KIM CƯƠNG</div>
              <div className="lower-part">Thời gian nhận nhà sau 02 tháng</div>
            </td>
          </tr>
          <tr>
            <td className="custom-cell">Đơn trên 50 triệu đến dưới 100 triệu (bao gồm phần nội thất và phần thô)</td>
            <td>Phần nội thất: 2% </td>
            <td>Phần nội thất: 5%</td>
            <td>
                <div>Phần nội thất: 5%</div>
                <div>Phần thô: 2%</div>
            </td>
          </tr>
          <tr>
            <td className="custom-cell">Đơn trên 100 triệu (bao gồm phần nội thất và phần thô)</td>
            <td>
                <div>Phần nội thất: 3%</div>
                <div>Phần thô: 2%</div>
            </td>
            <td>
                <div>Phần nội thất: 5%</div>
                <div>Phần thô: 2%</div>
            </td>
            <td>
                <div>Phần nội thất: 5%</div>
                <div>Phần thô: 4%</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PromotionTable;
