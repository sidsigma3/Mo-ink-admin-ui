import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getColorCountPerProduct } from '../../../services/ColorService';
import Toast from '../../../components/Toast/Toast';
import './ColorLibraryProducts.css';

const backendUrl = process.env.REACT_APP_IMAGE_URL;

// ✅ 1. Yarn image mapping data (placed BEFORE usage)
const yarnData = [
  {
    name: "Cotton",
    sku: "6 SKU",
    colors: "89 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn3.jpg?updatedAt=1749718954222",
  },
  {
    name: "Excel",
    sku: "5 SKU",
    colors: "25 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn2.jpg?updatedAt=1749718954429",
  },
  {
    name: "Micro Modal",
    sku: "2 SKU",
    colors: "4 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn5.jpg?updatedAt=1749718954471",
  },
  {
    name: "Bamboo",
    sku: "2 SKU",
    colors: "4 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn4.jpg?updatedAt=1749718954196",
  },
];

// ✅ 2. Create image map for easy lookup
const imageMap = yarnData.reduce((acc, item) => {
  acc[item.name.toLowerCase()] = item.image;
  return acc;
}, {});

const ColorLibraryProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const data = await getColorCountPerProduct();

      const transformed = data.map(product => ({
        productId: product.productId,
        name: product.productName,
        colorCount: product.colorCount,
        image: '', // we'll map the image below
      }));

      setProducts(transformed);
    } catch (error) {
      setToasts(prev => [
        ...prev,
        { id: Date.now(), message: 'Failed to load products.', type: 'error' },
      ]);
    }
  };

  return (
    <div className='colorlibrary'>
      <div className='top d-flex justify-content-between mt-2 mb-2'>
        <h4 style={{ fontSize: '1.2rem' }}>Color Library</h4>
      </div>

      <div className="py-5">
        <div className="row g-4 justify-content-center">
          {products.map((item, index) => (
            <div className="col-6 col-lg-2" key={index}>
              <div className="card h-100 shadow-sm border-0 rounded-4 position-relative">
                <div className="overflow-hidden rounded-top-4">
                  {/* ✅ 3. Use imageMap with fallback */}
                  <img
                    src={imageMap[item.name.toLowerCase()] || 'https://via.placeholder.com/150'}
                    alt={item.name}
                    className="w-100 rounded-4 p-3 zoom-img"
                    onClick={() =>
                      navigate("/colorlibrary", {
                        state: { productId: item.productId },
                      })
                    }
                  />
                </div>
                <div className="card-body text-center">
                  <h6 className="fw-bold text-dark mb-2">{item.name}</h6>
                  <p className="mb-0 text-muted">
                    {item.colorCount} Color
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ColorLibraryProducts;
