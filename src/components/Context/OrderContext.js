import React, { createContext, useState, useContext } from 'react';

// Create the context
const OrderContext = createContext();

// Provider component
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([
    {
      orderId: 'ORD12345',
      date: 'Nov 1, 3:02PM',
      customer: 'Rahul Sharma',
      quantity: 5,
      weight: '10 kg',
      amount: '₹1,500',
      payment: 'Paid',
      orderStatus: 'Delivered',
      manufacturer: '',
      orderDetail:[
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/60",
            "color": [
                "#d0021b"
            ]
        },
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/74",
            "color": [
                "#bd10e0"
            ]
        }
    ]
    },
    {
      orderId: 'ORD12346',
      date: 'Nov 1, 5:45PM',
      customer: 'Priya Gupta',
      quantity: 2,
      weight: '4 kg',
      amount: '₹750',
      payment: 'Unpaid',
      orderStatus: 'New Order',
      manufacturer: '',
      orderDetail:[
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/60",
            "color": [
                "#d0021b"
            ]
        },
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/74",
            "color": [
                "#bd10e0"
            ]
        }
    ]
    },
    {
      orderId: 'ORD12347',
      date: 'Nov 2, 11:20AM',
      customer: 'Amit Patel',
      quantity: 10,
      weight: '20 kg',
      amount: '₹3,000',
      payment: 'Paid',
      orderStatus: 'Shipped',
      manufacturer: 'TexHub',
      orderDetail:[
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/60",
            "color": [
                "#d0021b"
            ]
        },
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/74",
            "color": [
                "#bd10e0"
            ]
        }
    ]
    },
    {
      orderId: 'ORD12348',
      date: 'Nov 3, 1:10PM',
      customer: 'Sneha Nair',
      quantity: 7,
      weight: '14 kg',
      amount: '₹2,100',
      payment: 'Paid',
      orderStatus: 'In Transit',
      manufacturer: 'FiberWorks',
      orderDetail:[
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/60",
            "color": [
                "#d0021b"
            ]
        },
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/74",
            "color": [
                "#bd10e0"
            ]
        }
    ]
    },
    {
      orderId: 'ORD12349',
      date: 'Nov 3, 9:25AM',
      customer: 'Sarah Davis',
      quantity: 4,
      weight: '8 kg',
      amount: '₹1,200',
      payment: 'Unpaid',
      orderStatus: 'Rejected',
      manufacturer: 'FineTextile',
      orderDetail:[
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/60",
            "color": [
                "#d0021b"
            ]
        },
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/74",
            "color": [
                "#bd10e0"
            ]
        }
    ]
    },
    {
      orderId: 'ORD12350',
      date: 'Nov 4, 2:15PM',
      customer: 'David Wilson',
      quantity: 3,
      weight: '6 kg',
      amount: '₹900',
      payment: 'Paid',
      orderStatus: 'Delivered',
      manufacturer: 'WeaveCo',
      orderDetail:[
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/60",
            "color": [
                "#d0021b"
            ]
        },
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/74",
            "color": [
                "#bd10e0"
            ]
        }
    ]
    },
    {
      orderId: 'ORD12351',
      date: 'Nov 4, 10:00AM',
      customer: 'Emma Martinez',
      quantity: 6,
      weight: '12 kg',
      amount: '₹1,800',
      payment: 'Unpaid',
      orderStatus: 'In Transit',
      manufacturer: 'Textura Mills',
      orderDetail:[
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/60",
            "color": [
                "#d0021b"
            ]
        },
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/74",
            "color": [
                "#bd10e0"
            ]
        }
    ]
    },
    {
      orderId: 'ORD12352',
      date: 'Nov 5, 4:35PM',
      customer: 'Oliver Garcia',
      quantity: 8,
      weight: '16 kg',
      amount: '₹2,400',
      payment: 'Paid',
      orderStatus: 'Shipped',
      manufacturer: 'Thread Factory',
      orderDetail:[
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/60",
            "color": [
                "#d0021b"
            ]
        },
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/74",
            "color": [
                "#bd10e0"
            ]
        }
    ]
    },
    {
      orderId: 'ORD12353',
      date: 'Nov 6, 3:15PM',
      customer: 'Sophia White',
      quantity: 1,
      weight: '2 kg',
      amount: '₹300',
      payment: 'Unpaid',
      orderStatus: 'New Order',
      manufacturer: 'CottonCraft',
      orderDetail:[
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/60",
            "color": [
                "#d0021b"
            ]
        },
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/74",
            "color": [
                "#bd10e0"
            ]
        }
    ]
    },
    {
      orderId: 'ORD12354',
      date: 'Nov 6, 6:45PM',
      customer: 'James Thomas',
      quantity: 12,
      weight: '24 kg',
      amount: '₹3,600',
      payment: 'Paid',
      orderStatus: 'Delivered',
      manufacturer: 'LoomLine',
      orderDetail:[
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/60",
            "color": [
                "#d0021b"
            ]
        },
        {
            "productId": "1",
            "productName": "Cotton Yarn",
            "size": "2/74",
            "color": [
                "#bd10e0"
            ]
        }
    ]
    },
  ]);

  return (
    <OrderContext.Provider value={{ orders, setOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

// Hook to use the OrderContext
export const useOrderContext = () => {
  return useContext(OrderContext);
};
