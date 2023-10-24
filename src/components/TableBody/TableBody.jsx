import React, { useState, useEffect } from 'react';
import './TableBody.scss';
import * as math from 'mathjs';


const TableBody = (props) => {
  const [apiResponse, setApiResponse] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openImageModal = (url,index) => {
    setImageModalOpen(true);
    setLargeImageURL(url);
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setLargeImageURL('');
  };

  const navigateToPreviousImage = () => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setLargeImageURL(tableData[newIndex].referenceImage);
      setCurrentImageIndex(newIndex);
    }
  };
  
  const navigateToNextImage = () => {
    if (currentImageIndex < tableData.length - 1) {
      const newIndex = currentImageIndex + 1;
      setLargeImageURL(tableData[newIndex].referenceImage);
      setCurrentImageIndex(newIndex);
    }
  };
  

  const supplierId = props.supplierId;

  const [apiProducts, setApiProducts] = useState([]);
  useEffect(() => {
    fetch('https://api.lanha.vn/api/v1/quote/products')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setApiProducts(data.data);
        setApiResponse(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const { Parser } = require('expr-eval');

  const calculateWeight = (product, length, width, height) => {
    if (product && product.formulaQuantity) {
      const processedFormula = product.formulaQuantity
        .replace(new RegExp("Cao", "g"), height)
        .replace(new RegExp("Rộng", "g"), width)
        .replace(new RegExp("Dài", "g"), length)
        .replace(new RegExp("Khối lượng", "g"), length);
      const weight = eval(processedFormula);
      return weight;
    } else {
      return 0; // Hoặc giá trị mặc định khác tùy thuộc vào logic của bạn
    }
  };
  

  const calculateUnit = (product, length, width, height) => {
    // Thay thế biểu thức đơn vị bằng các biến liên quan
    const formula = product.unit
      .replace(new RegExp("Dài", "g"), length)
      .replace(new RegExp("Rộng", "g"), width)
      .replace(new RegExp("Cao", "g"), height);
  
    // Thay thế biểu thức ba ngôi bằng kết quả
    const formulaWithValues = formula.replace(/\(([^)]+)\) \? "([^"]+)" : "([^"]+)"/, (_, condition, trueResult, falseResult) => {
      const evalCondition = eval(condition); // Đánh giá biểu thức điều kiện
      return evalCondition ? trueResult : falseResult;
    });
    console.log(formulaWithValues);
    try {
      // Đánh giá công thức bằng cách sử dụng math.js
      //const unit = math.evaluate(formulaWithValues);
      return formulaWithValues;
    } catch (error) {
      return "Công thức không hợp lệ";
    }
  };
  

  const calculateTotal = (product, length, width, height, weight, price) => {
  if (product && product.formulaPrice) {
    const formula = product.formulaPrice
      .replace('Dài', length)
      .replace('Rộng', width)
      .replace('Cao', height)
      .replace('Khối lượng', weight)
      .replace('Đơn giá', price);
    const total = eval(formula);
    return total;
  } else {
    return 0; // Hoặc giá trị mặc định khác tùy thuộc vào logic của bạn
  }
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
      referenceImage: [],
      length: '',
      width: '',
      height: '',
    },
  ]);

  const [footerRows, setFooterRows] = useState([
    {
      title: 'TỔNG CỘNG',
      total: 0,
    }
  ]);

  useEffect(() => {
    if (apiProducts.length > 0 && tableData.length > 0) {
      const updatedTableData = [...tableData];
      updatedTableData.forEach((row) => {
        const selectedProduct = row.product;
        if (selectedProduct) {
          const supp = supplierId;
          if (supp) {
            const material = row.materialOptions.find((option) => option.value === row.description);
            if (material) {
              const price = material.materialList.price.find((price) => price.trademark === supp);
              row.price = price ? price.priceValue : '';
            } else {
              row.price = '';
            }
          }
        }
        const length = parseFloat(row.length) || 0;
        const width = parseFloat(row.width) || 0;
        const height = parseFloat(row.height) || 0;
        const weight = calculateWeight(selectedProduct, length, width, height);
        const price = parseFloat(row.price) || 0;
        const total = calculateTotal(selectedProduct, length, width, height, weight, price);
      });

      setTableData(updatedTableData);
      calculateTotalPrice();
    }
  }, [supplierId, apiProducts, tableData]);

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
        isEditable: true,
      },
    ]);
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const [isDescriptionDropdownOpen, setDescriptionDropdownOpen] = useState(Array(tableData.length).fill(false));


  const updateSelectedMaterials = (productId) => {
    const product = apiProducts.find((product) => product._id === productId);

    if (product) {
      setSelectedMaterials(product.listMaterial);
    } else {
      setSelectedMaterials([]);
    }
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(tableData.map(() => false));
  const [selectedProducts, setSelectedProducts] = useState([]);

  const toggleDropdown = (index) => {
    const updatedIsDropdownOpen = [...isDropdownOpen];
    updatedIsDropdownOpen[index] = !updatedIsDropdownOpen[index];
    setIsDropdownOpen(updatedIsDropdownOpen);
  };

  const toggleDescriptionDropdown = (index) => {
    const updatedIsDescriptionDropdownOpen = [...isDescriptionDropdownOpen];
    updatedIsDescriptionDropdownOpen[index] = !updatedIsDescriptionDropdownOpen[index];
    setDescriptionDropdownOpen(updatedIsDescriptionDropdownOpen);
  };
  
  const calculateUnit2 = (product) => {
  
    // Kiểm tra xem unit có chứa các trường "Dài", "Rộng", hoặc "Cao" hay không
    if (product.unit.includes("Dài") || product.unit.includes("Rộng") || product.unit.includes("Cao")) {
      return null; // Nếu có, trả về null
    }else{
      return product.unit;
    }
  };
  

  const handleProductChange = (index, selectedProduct) => {
    if (selectedProduct) {
      const updatedTableData = [...tableData];
      updatedTableData[index].product = selectedProduct;

      console.log(selectedProduct);

      if (selectedProduct.price) {
        updatedTableData[index].price = selectedProduct.price;
      } else {
        updatedTableData[index].price = '';
      }
      

      const updatedSelectedProducts = [...selectedProducts];
      updatedSelectedProducts[index] = selectedProduct;
      setSelectedProducts(updatedSelectedProducts);

      const selectedDescription = selectedProduct.description || 'Chọn mô tả';
      updatedTableData[index].description = selectedDescription;
      updatedTableData[index].selectedDescription = '';
      console.log(selectedProduct.description);
      const unit = calculateUnit2(selectedProduct);
      updatedTableData[index].unit = unit;
      //updatedTableData[index].unit = selectedProduct.unit || '';
      updatedTableData[index].note = selectedProduct.note || '';
      updatedTableData[index].referenceImage = selectedProduct.listMaterial.imgUrl || '';
      updatedTableData[index].weight = '';
      updatedTableData[index].total = '';
      updatedTableData[index].length = selectedProduct.size.width || '';
      updatedTableData[index].width = selectedProduct.size.depth || '';
      updatedTableData[index].height = selectedProduct.size.height || '';
      updatedTableData[index].referenceImage = selectedProduct.imgUrl || '';

      updatedTableData[index].materialOptions = selectedProduct.listMaterial.map((material) => ({
        value: material.material.description,
        label: material.material.description,
        materialList: material,
        imgUrl: material.material.imgUrl,
      }));

      setTableData(updatedTableData);
    }
  };

  const handleDescriptionChange = (index, selectedValue) => {
    const updatedTableData = [...tableData];
    updatedTableData[index].selectedDescription = selectedValue;

    updatedTableData[index].description = selectedValue;
    const selectedProduct = updatedTableData[index].product;
    console.log(selectedProduct);
    console.log(selectedValue);

    const matchedMaterial = selectedProduct.listMaterial.find(
      (material) => material.material.description === selectedValue
    );
    
    if (matchedMaterial) {
      const imgUrls = matchedMaterial.material.imgUrl;
      updatedTableData[index].referenceImage = imgUrls;
      console.log("Image URLs:", imgUrls);
    } else {
      console.log("Không tìm thấy mô tả khớp.");
    }

    if (selectedValue && selectedValue.materialList && selectedValue.materialList.material && selectedValue.materialList.material.price) {
      updatedTableData[index].price = selectedValue.materialList.material.price;
  } else {
      const supp = supplierId;

      if (supp) {
        const material = selectedValue.materialList;
        console.log(material);

        if (material) {
          const price = material.price.find((price) => price.trademark === supp);
          updatedTableData[index].price = price ? price.priceValue : '';
        } else {
          updatedTableData[index].price = '';
        }
      }
    }
    const updatedIsDescriptionDropdownOpen = [...isDescriptionDropdownOpen];
    updatedIsDescriptionDropdownOpen[index] = false;
    setDescriptionDropdownOpen(updatedIsDescriptionDropdownOpen);

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
    const unit = calculateUnit(product, length, width, height);
    updatedTableData[index].unit = unit

    updatedTableData[index].weight = weight;
    const price = parseFloat(updatedTableData[index].price) || 0;
    const total = calculateTotal(product, length, width, height, weight, price);

    updatedTableData[index].total = total.toString();
    setTableData(updatedTableData);
  };

  return (
    <div>
      <table className="table-body">
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index} onContextMenu={(e) => handleContextMenu(e, index)} onClick={closeContextMenu} className="table-row">
            <td className="table-cell product">
            <div className={`custom-select ${isDropdownOpen[index] ? 'active' : ''}`} onClick={() => toggleDropdown(index)}>
                  <div className="selected-option">{selectedProducts[index] && selectedProducts[index].name ? selectedProducts[index].name : 'Chọn sản phẩm'}</div>
                  <div className="dropdown-arrow">{isDropdownOpen[index] ? '▲' : '▼'}</div>
                  {isDropdownOpen[index] && (
                    <div className="options">
                      {apiProducts.map((product) => (
                        <div key={product._id} className="option" onClick={() => handleProductChange(index, product)}>
                          {product.name}
                        </div>
                    ))}
                  </div>
                )}
              </div>
              </td>
              <td className="table-cell description">
              <div
                  className={`custom-select ${isDescriptionDropdownOpen[index] ? 'active' : ''}`}
                  onClick={() => toggleDescriptionDropdown(index)}
                >
                <div className="selected-option">
                  {row.selectedDescription ? row.selectedDescription : '-- Chọn mô tả --'}
                </div>
                <div className="dropdown-arrow">
                  {isDescriptionDropdownOpen[index] ? '▲' : '▼'}
                </div>
                {isDescriptionDropdownOpen[index] && row.materialOptions && row.materialOptions.length > 0 &&(
                  <div className="options">
                    {row.materialOptions.map((option) => (
                      <div
                        key={option.value}
                        className="option"
                        onClick={() => handleDescriptionChange(index, option.value, option.imgUrl)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </td>
              <td className="table-cell size-item">
                <input
                  type="number"
                  value={row.length}
                  onChange={(e) => handleInputChange(index, 'length', e.target.value)}
                />
              </td>
              <td className="table-cell size-item">
                <input
                  type="number"
                  value={row.width}
                  onChange={(e) => handleInputChange(index, 'width', e.target.value)}
                />
              </td>
              <td className="table-cell size-item">
                <input
                  type="number"
                  value={row.height}
                  onChange={(e) => handleInputChange(index, 'height', e.target.value)}
                />
              </td>
              <td className="table-cell unit">{row.unit}</td>
              <td className="table-cell weight">{row.weight}</td>
              <td className="table-cell price">{Number(row.price).toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
              })}</td>
              <td className="table-cell total">
              {Number(row.total).toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
              })}
            </td>
              <td className="table-cell note">{row.note}</td>
              <td className="table-cell reference-image">
              <div className="image-container">
            {Array.isArray(row.referenceImage) && row.referenceImage.length > 0 ? (
            row.referenceImage.slice(0, 3).map((imgUrl, imgIndex) => (
              <img
                key={imgIndex}
                className="reference-image-item"
                style={{ width: "30%" }}
                src={`https://api.lanha.vn/profiles/icon-img/${imgUrl}`}
                alt={`Ảnh mô tả ${imgIndex + 1}`}
                onClick={() => openImageModal(`https://api.lanha.vn/profiles/icon-img/${imgUrl}`)}
              />
            ))
          ) : null}
            {Array.isArray(row.referenceImage) && row.referenceImage.length > 3 ? (
              <div className="reference-image-overlay">+{row.referenceImage.length - 3} ảnh</div>
            ) : null}
          </div>
          </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow} className="add-row-button">
        <i className="fas fa-plus"></i> +
      </button>
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
      {isImageModalOpen && (
  <div className="image-modal">
    <div className="modal-content">
      <span className="close" onClick={closeImageModal}>&times;</span>
      <div className="image-navigation">
        {currentImageIndex > 0 && (
          <button onClick={navigateToPreviousImage}>{"<"}</button>
        )}
        {currentImageIndex < (tableData.length - 1) && (
          <button onClick={navigateToNextImage}>{">"}</button>
        )}
      </div>
      <img
        src={largeImageURL}
        alt="Ảnh lớn"
        className="large-image"
      />
    </div>
  </div>
)}


    </div>
  );
};

export default TableBody;
