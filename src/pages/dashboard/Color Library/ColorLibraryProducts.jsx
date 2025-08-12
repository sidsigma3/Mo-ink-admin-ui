import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getColorCountPerProduct } from '../../../services/ColorService';
import Toast from '../../../components/Toast/Toast';
import './ColorLibraryProducts.css';

const backendUrl = process.env.REACT_APP_IMAGE_URL;

// Yarn image mapping data
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
  {
    name: "Lenzing Micro Modal",
    sku: "2 SKU",
    colors: "4 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn1.png?updatedAt=1754928796191",
  },
  {
    name: "Viscose",
    sku: "2 SKU",
    colors: "4 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn7.jpg?updatedAt=1749718954502",
  },
  {
    name: "Tencel",
    sku: "2 SKU",
    colors: "4 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn6.jpg?updatedAt=1749718954437",
  },
  {
    name: "Ecovero",
    sku: "2 SKU",
    colors: "4 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn8.png?updatedAt=1754927536082",
  },
  {
    name: "Birla Micro Modal",
    sku: "2 SKU",
    colors: "4 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn8%20(3).png?updatedAt=1754927535975",
  },
  {
    name: "Livaeco",
    sku: "2 SKU",
    colors: "4 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn8%20(2).png?updatedAt=1754927535634",
  },
  {
    name: "Flax Varieties",
    sku: "2 SKU",
    colors: "4 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn7%20%20.png?updatedAt=1754927543913",
  },
   {
    name: "Excel-Linen",
    sku: "2 SKU",
    colors: "4 Color",
    image: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn8.png?updatedAt=1754927906052",
  },
];

// Create image map for easy lookup
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

  const handleCardClick = (productId, event) => {
    // Prevent event bubbling if needed
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Navigating to productId:', productId); // Debug log
    navigate("/colorlibrary", { state: { productId } });
  };

  const handleImageClick = (productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Image clicked for productId:', productId); // Debug log
    navigate("/colorlibrary", { state: { productId } });
  };

  const fetchProductData = async () => {
    try {
      const data = await getColorCountPerProduct();

      const transformed = data.map(product => ({
        productId: product.productId,
        name: product.productName,
        colorCount: product.colorCount,
        image: '', // we'll map the image below
      }));

      console.log('Fetched products:', transformed); // Debug log
      setProducts(transformed);
    } catch (error) {
      console.error('Error fetching products:', error); // Debug log
      setToasts(prev => [
        ...prev,
        { id: Date.now(), message: 'Failed to load products.', type: 'error' },
      ]);
    }
  };

  return (
    <div className='colorlibrary'>
      <div className='top d-flex justify-content-between mt-3 mb-2'>
        <h4 style={{ fontSize: '1.2rem' }}>Color Library</h4>
      </div>

      <div className="py-5 zindex">
        <div className="row g-3 justify-content-center">
          {products.map((item, index) => (

            <div className="col-6 col-lg-2 mt-0 mb-3" key={index}
            style={{cursor:'pointer'}}
             onClick={() =>{
                      navigate("/colorlibrary", {
                        state: { productId: item.productId },
                      })
                    }}
            >
              <div className="card h-80 shadow-sm border-0 rounded-4 ">
                <div className="overflow-hidden rounded-top-4" 
                  
                >
                  {/* ✅ 3. Use imageMap with fallback */}
                  <img
                  src={imageMap[item.name.toLowerCase()] || 'https://via.placeholder.com/150'}
                  alt={item.name}
                  className="w-100 rounded-4 p-1 zoom-img"
                  style={{
                    aspectRatio: 'var(--aspect-ratio, auto)',
                    objectFit: 'cover'
                  }}
                  />
                </div>
                
                <div className="card-body py-1  d-flex align-items-center justify-content-between gap-2">
                <h6 className="fw-medium text-dark mb-0 text-start " style={{ fontSize: '14px'}}>{item.name}</h6>
                <p className="mb-0 fs-7 text-muted text-center"  style={{ fontSize: '12px'}}>
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