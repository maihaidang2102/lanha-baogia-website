import React, { useState , useEffect } from 'react';
import './TableBody.scss';

const TableBody = () => {
  const products = [
    {
      name: 'Sản phẩm 1',
      description: 'Mô tả 1',
      unit: 'Đơn vị 1',
      weight: 'Khối lượng 1',
      price: '100',
      total: 'Thành tiền 1',
      note: 'Ghi chú 1',
      referenceImage: 'Hình ảnh 1',
    },
    {
      name: 'Sản phẩm 2',
      description: 'Mô tả 2',
      unit: 'Đơn vị 2',
      weight: 'Khối lượng 2',
      price: '200',
      total: 'Thành tiền 2',
      note: 'Ghi chú 2',
      referenceImage: 'Hình ảnh 2',
    },
    {
      name: 'Sản phẩm 3',
      description: 'Mô tả 3',
      unit: 'Đơn vị 3',
      weight: 'Khối lượng 3',
      price: '300',
      total: 'Thành tiền 3',
      note: 'Ghi chú 3',
      referenceImage: 'Hình ảnh 3',
    },
  ];
  const calculateTotal = (length, width, height, price) => {
    const numericLength = parseFloat(length) || 0;
    const numericWidth = parseFloat(width) || 0;
    const numericHeight = parseFloat(height) || 0;
    const numericPrice = parseFloat(price) || 0;

    const total = numericLength * numericWidth * numericHeight * numericPrice;

    return total;
  };

  const [contextMenuIndex, setContextMenuIndex] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  const handleContextMenu = (e, index) => {
    e.preventDefault();
    setContextMenuIndex(index);
    setContextMenuPosition({ top: e.clientY, left: e.clientX });
    setIsContextMenuOpen(true);
  };
  const deleteRow = () => {
    if (contextMenuIndex !== null) {
      const updatedTableData = [...tableData];
      updatedTableData.splice(contextMenuIndex, 1);
      setTableData(updatedTableData);
      setContextMenuIndex(null);
    }
  };
  const closeContextMenu = () => {
    setContextMenuIndex(null);
    setIsContextMenuOpen(false);
  };
 

  const [tableData, setTableData] = useState([{
    product: products[0],
    description: products[0].description,
    unit: products[0].unit,
    weight: products[0].weight,
    price: products[0].price,
    total: products[0].total,
    note: products[0].note,
    referenceImage: products[0].referenceImage,
    length: '',
    width: '',
    height: '',
  }]);

  const [footerRows, setFooterRows] = useState([
    {
      title: 'TỔNG CỘNG',
      total: 0,
    },
    {
      title: 'HỖ TRỢ THIẾT KẾ 3D SKETCHUP MIỄN PHÍ',
      total: 0,
    },
    {
      title: 'GIẢM GIÁ 2% NỘI THẤT CHO ĐƠN HÀNG TRÊN 50 TRIỆU DƯỚI 100T RIỆU THEO CHƯƠNG TRÌNH KHUYỄN MÃI BẠC 9 CHƯA BAO GỒM SOFA)',
      total: 0,
    },
    {
      title: 'GIẢM 5% SOFA KHI THI CÔNG TRONG THÁNG 11',
      total: 0,
    },
    {
      title: 'TỔNG SỐ TIỀN CÒN LẠI',
      total: 0,
    },
  ]);


  
  const calculateTotalPrice = () => {
    let totalPrice = 0;

    tableData.forEach((row) => {
      const numericPrice = parseFloat(row.price) || 0;
      const numericLength = parseFloat(row.length) || 0;
      const numericWidth = parseFloat(row.width) || 0;
      const numericHeight = parseFloat(row.height) || 0;

      totalPrice += numericPrice * numericLength * numericWidth * numericHeight;
    });

    setFooterRows((prevFooterRows) =>
      prevFooterRows.map((row, index) =>
        index === 0 ? { ...row, total: totalPrice.toString() } : row
      )
    );
  };

  const [showAddRowButton, setShowAddRowButton] = useState(false);

  const handleMouseEnter = () => {
    // Khi con trỏ chuột vào bảng, hiển thị nút "Thêm hàng"
    setShowAddRowButton(true);
  };

  const handleMouseLeave = () => {
    // Khi con trỏ chuột ra khỏi bảng, ẩn nút "Thêm hàng"
    setShowAddRowButton(false);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [tableData]);

  useEffect(() => {
    const updatedTableData = tableData.map((row) => ({
      ...row,
      total: calculateTotal(row.length, row.width, row.height, row.price).toString(),
    }));
    setTableData(updatedTableData);
  }, [tableData]);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (!e.target.closest('.table-row')) {
        closeContextMenu();
      }
    };
  
    document.addEventListener('click', handleDocumentClick);
  
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);
  

  const addRow = () => {
    setTableData([
      ...tableData,
      {
        product: products[0],
        description: products[0].description,
        unit: products[0].unit,
        weight: products[0].weight,
        price: products[0].price,
        total: products[0].total,
        note: products[0].note,
        referenceImage: products[0].referenceImage,
        length: '',
        width: '',
        height: '',
      },
    ]);
  };

  const handleProductChange = (index, selectedProduct) => {
    const updatedTableData = [...tableData];
    updatedTableData[index].product = selectedProduct;
    updatedTableData[index].description = selectedProduct.description;
    updatedTableData[index].unit = selectedProduct.unit;
    updatedTableData[index].weight = selectedProduct.weight;
    updatedTableData[index].price = selectedProduct.price;
    updatedTableData[index].total = selectedProduct.total;
    updatedTableData[index].note = selectedProduct.note;
    updatedTableData[index].referenceImage = selectedProduct.referenceImage;
    setTableData(updatedTableData);
  };

  const handleInputChange = (index, field, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][field] = value;
    setTableData(updatedTableData);
  };

  return (
    <div onMouseLeave={handleMouseLeave} >
      <table className="table-body" onMouseEnter={handleMouseEnter} >
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index} onContextMenu={(e) => handleContextMenu(e, index)} onClick={closeContextMenu} className="table-row" onMouseEnter={() => handleMouseEnter(index)}>
              <td className="table-cell product">
                <select
                  value={row.product.name}
                  onChange={(e) => {
                    const selectedProduct = products.find(p => p.name === e.target.value);
                    handleProductChange(index, selectedProduct);
                  }}
                >
                  {products.map(product => (
                    <option key={product.name} value={product.name}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="table-cell description">{row.description}</td>
              <td className="table-cell size-item">
                <input
                  type="text"
                  value={row.length}
                  onChange={(e) => handleInputChange(index, 'length', e.target.value)}
                />
              </td>
              <td className="table-cell size-item">
                <input
                  type="text"
                  value={row.width}
                  onChange={(e) => handleInputChange(index, 'width', e.target.value)}
                />
              </td>
              <td className="table-cell size-item">
                <input
                  type="text"
                  value={row.height}
                  onChange={(e) => handleInputChange(index, 'height', e.target.value)}
                />
              </td>
              <td className="table-cell unit">{row.unit}</td>
              <td className="table-cell weight">{row.weight}</td>
              <td className="table-cell price">{row.price}</td>
              <td className="table-cell total">{row.total}</td>
              <td className="table-cell note">{row.note}</td>
              <td className="table-cell reference-image">{row.referenceImage}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddRowButton && (
        <button onClick={addRow} className="add-row-button">
          <i className="fas fa-plus"></i> +
        </button>
      )}
      {contextMenuIndex !== null && (
        <div className="context-menu" style={{ top: contextMenuPosition.top, left: contextMenuPosition.left }}>
          <div onClick={deleteRow}>Xóa hàng này</div>
        </div>
      )}
      <table className="table-footer">
        <tbody>
          {footerRows.map((row, index) => (
            <tr key={index}>
              <td className="footer-title">{row.title}</td>
              <td className="footer-total">{row.total}</td>
              <td className="footer-note"></td>
              <td className="footer-totdescriptional"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableBody;
