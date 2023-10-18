import React, { useState , useEffect } from 'react';
import Select from 'react-select';
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
      note: 'Ghi chú 15311332',
      referenceImage: 'Hình ảnh 1',
    },
    {
      name: 'Sản phẩm mai hải đăng dz',
      description: 'Mô tả 2',
      unit: 'Đơn vị 2',
      weight: 'Khối lượng 2',
      price: '200',
      total: 'Thành tiền 2',
      note: 'Thuộc tính white-space: pre-wrap; cho phép nội dung tự động xuống hàng khi nó dài hơn độ rộng của cột mà không làm thay đổi kích thước của cột. Điều này đã được sử dụng chính xác trong mã của bạn.',
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

  const [apiResponse, setApiResponse] = useState(null);


  const [apiProducts, setApiProducts] = useState([]);
  useEffect(() => {
    // Gọi API và lấy dữ liệu từ API
    // Sử dụng fetch hoặc axios để gọi API, sau đó cập nhật state apiProducts
    fetch('https://api.lanha.vn/api/v1/quote/products')
      .then(response => response.json())
      .then(data => {
        console.log(data); // In dữ liệu từ API ra console
        setApiProducts(data.data);
        setApiResponse(data);
      })
      .catch(error => console.error(error));
  }, []);

  const { Parser } = require('expr-eval');

// Hàm tính toán giá dựa trên công thức
const calculateWeight = (product, length, width, height) => {
  // Tạo một trình phân tích biểu thức
  const parser = new Parser();
  
  // Tạo ngữ cảnh biểu thức với các biến (Dài, Rộng, Cao) và giá trị tương ứng
  const context = {
    Dài: length,
    Rộng: width,
    Cao: height,
  };
  
  // Parse và tính toán biểu thức
  const weight = parser.parse(product.formulaQuantity).evaluate(context);
  
  return weight;
};

  

const calculateTotal = (product, length, width, height, weight, price) => {
  const parser = new Parser();

  // Lấy công thức tương ứng với sản phẩm
  const formula = product.formulaPrice;

  // Tạo ngữ cảnh biểu thức với các biến (Dài, Rộng, Cao, Khối_lượng, Đơn_giá) và giá trị tương ứng
  const context = {
    Dài: length,
    Rộng: width,
    Cao: height,
    'Khối lượng': weight,
    'Đơn_giá': price,
  };

  // Parse và tính toán công thức
  const total = parser.parse(formula).evaluate(context);

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
    updatedTableData[index].price = selectedProduct.price;
    const length = updatedTableData[index].length;
    const width = updatedTableData[index].width;
    const height = updatedTableData[index].height;

    // Tính toán giá mới sử dụng calculatePrice
    const weight = calculateWeight(selectedProduct, length, width, height);
    
    updatedTableData[index].weight = weight.toString();
    setTableData(updatedTableData);
  };

  const handleInputChange = (index, field, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][field] = value;
    const product = updatedTableData[index].product;

  // Lấy các giá trị kích thước hiện tại từ dữ liệu bảng
  const length = updatedTableData[index].length;
  const width = updatedTableData[index].width;
  const height = updatedTableData[index].height;

  // Tính toán giá mới sử dụng calculatePrice
  const weight = calculateWeight(product, length, width, height);

  updatedTableData[index].weight = weight.toString();
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
  value={row.product._id} // Sử dụng _id để đối chiếu sản phẩm
  onChange={(e) => {
    const selectedProduct = apiProducts.find(product => product._id === e.target.value);
    handleProductChange(index, selectedProduct);
  }}
>
  {apiProducts.map(product => (
    <option key={product._id} value={product._id}>
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