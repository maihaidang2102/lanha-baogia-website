import React, { useState , useEffect } from 'react';
import Select from 'react-select';
import './TableBody.scss';

const TableBody = (props) => {
  const [apiResponse, setApiResponse] = useState(null);

  const supplierId = props.supplierId;
  console.log(supplierId);
  

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

function calculateWeight(product, length, width, height) {
  const processedFormula = product.formulaQuantity
      .replace(new RegExp("Cao", "g"), height)
      .replace(new RegExp("Rộng", "g"), width)
      .replace(new RegExp("Dài", "g"), length)
      .replace(new RegExp("Khối lượng", "g"), length)
  const weight = eval(processedFormula);

  return weight;
}

const calculateTotal = (product, length, width, height, weight, price) => {
  const formula = product.formulaPrice;

  const formulaWithReplacedVariables = formula
    .replace('Dài', length)
    .replace('Rộng', width)
    .replace('Cao', height)
    .replace('Khối lượng', weight)
    .replace('Đơn giá', price);

  const total = eval(formulaWithReplacedVariables);

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
 

  const [tableData, setTableData] = useState([
    {
      product: null,
      description: '',
      unit: '',
      weight: '',
      price: '',
      total: '',
      note: '',
      referenceImage: '',
      length: '',
      width: '',
      height: '',
    },
  ]);

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
      const numericTotal = parseFloat(row.total) || 0;
      

      totalPrice += numericTotal;
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
        product: null,
        description: '',
        unit: '',
        weight: '',
        price: '',
        total: '',
        note: '',
        referenceImage: '',
        length: '',
        width: '',
        height: '',
      },
    ]);
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const updateSelectedMaterials = (productId) => {
    // Tìm sản phẩm có productId trong danh sách sản phẩm
    const product = apiProducts.find((product) => product._id === productId);
  
    if (product) {
      setSelectedMaterials(product.listMaterial);
    } else {
      setSelectedMaterials([]); // Nếu không tìm thấy sản phẩm, đặt danh sách vật liệu thành rỗng
    }
  };
  


  const handleProductChange = (index, selectedProduct) => {
  if (selectedProduct) {
    const updatedTableData = [...tableData];
    updatedTableData[index].product = selectedProduct;

    if (selectedProduct.price) {
      updatedTableData[index].price = selectedProduct.price;
    } else {
      updatedTableData[index].price = '';
    }

    updatedTableData[index].description = selectedProduct.description || '';
    updatedTableData[index].unit = selectedProduct.unit || '';
    updatedTableData[index].note = selectedProduct.note || '';
    updatedTableData[index].referenceImage = selectedProduct.referenceImage || '';
    updatedTableData[index].weight = '';
    updatedTableData[index].total = '';
    updatedTableData[index].length = selectedProduct.size.width || '';
    updatedTableData[index].width = selectedProduct.size.depth || '';
    updatedTableData[index].height = selectedProduct.size.height || '';
    updatedTableData[index].referenceImage = selectedProduct.imgUrl || '';

    updatedTableData[index].materialOptions = selectedProduct.listMaterial.map((material) => ({
      value: material.material.description,
      label: material.material.description,
      materialList : material,
      imgUrl: material.material.imgUrl,
    }));

    setTableData(updatedTableData);
  }
};

const handleDescriptionChange = (index, selectedValue) => {
  const updatedTableData = [...tableData];
  updatedTableData[index].description = selectedValue;

  const selectedProduct = updatedTableData[index].product;
  console.log(selectedProduct);
  console.log(selectedValue);

  if (selectedValue && selectedValue.materialList.material.price) {
    updatedTableData[index].price = selectedValue.materialList.material.price;
  } else {
    const supp = supplierId; 

    if (supp) {
      const material = selectedValue.materialList;
      console.log(material);

      if (material) {
        const price = material.price.find(price => price.trademark === supp);
        updatedTableData[index].price = price ? price.priceMoistureResistantMDF : '';
      } else {
        updatedTableData[index].price = '';
      }
    }
  }

  setTableData(updatedTableData);
};

  const handleInputChange = (index, field, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][field] = value;
    const product = updatedTableData[index].product;

  const length = updatedTableData[index].length || 0;
  const width = updatedTableData[index].width || 0;
  const height = updatedTableData[index].height || 0;
  const weight = calculateWeight(product, length, width, height);

  updatedTableData[index].weight = weight.toString();
  const price = parseFloat(updatedTableData[index].price) || 0;
  const total = calculateTotal(product, length, width, height, weight, price);

  updatedTableData[index].total = total.toString();
    setTableData(updatedTableData);
  };

  return (
    <div onMouseLeave={handleMouseLeave} >
      <table className="table-body" onMouseEnter={handleMouseEnter} >
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index} onContextMenu={(e) => handleContextMenu(e, index)} onClick={closeContextMenu} className="table-row" onMouseEnter={() => handleMouseEnter(index)}>
              <td className="table-cell product">
              <select className="select__control"
                  value={row.product ? row.product._id : ''} // Sử dụng _id để đối chiếu sản phẩm
                  onChange={(e) => {
                    const selectedProduct = apiProducts.find((product) => product._id === e.target.value);
                    handleProductChange(index, selectedProduct);
                  }}
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {apiProducts.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="table-cell description">
              <select
              className="custom-description-select" // Thêm lớp CSS tùy chỉnh
              value={row.description} // Đặt giá trị `value` cho select
              onChange={(e) => {
                // Lấy giá trị đã chọn và tìm ảnh tương ứng
                const selectedValue = e.target.value;
                const selectedOption = row.materialOptions.find((option) => option.value === selectedValue);
                handleDescriptionChange(index, row.materialOptions.find((option) => option.value === selectedValue));
                handleInputChange(index, 'description', selectedValue); // Cập nhật mô tả
                handleInputChange(index, 'referenceImage', selectedOption ? selectedOption.imgUrl : ''); // Cập nhật ảnh
              }}
            >
              <option value="">-- Chọn mô tả --</option>
              {row.materialOptions && row.materialOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            </select>
              </td>
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
              <td className="table-cell reference-image">
  <img src={`https://api.lanha.vn/profiles/icon-img/${row.referenceImage}`} alt="Ảnh mô tả" />
</td>

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