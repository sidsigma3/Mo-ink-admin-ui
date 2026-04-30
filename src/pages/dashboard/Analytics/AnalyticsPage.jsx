import React, { useEffect, useState } from 'react'
import Filter from '../../../components/Filter/DayFilter/Filter'
import SalesMap from '../../../components/Analylitcs/Graph/Map/SalesMap';
import TotalSales from './Graphs/TotalSales';
import TotalOrders from './Graphs/TotalOrders';
import AvgOrder from './Graphs/AvgOrder';
import TopProducts from './Graphs/TopProducts';
import TopSellingCounter from './Graphs/TopSellingCounter';
import TopSellingColor from './Graphs/TopSellingColor';
import OnlineStoreConversionRate from './Graphs/OnlineStoreConversionRate';
import OnlineStoreSession from './Graphs/OnlineStoreSession';
import SessionByDevice from './Graphs/SessionByDevice';
import TopCustomers from './Graphs/TopCustomers';
import { getAnalytics } from '../../../services/analyticsService';

const AnalyticsPage = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await getAnalytics();
          if (res && res.data) {
            setAnalyticsData(res.data);
          }
        } catch (error) {
          console.error('Error fetching analytics:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);

  return (
    <div className='analytics-page '>
        <div className='top d-flex align-items-center justify-content-between mt-3'>
            <h4 className='m-0 text-center' style={{fontSize:'1.2rem'}}>Analytics</h4>
            <Filter></Filter>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <div className="spinner-border" style={{ color: '#6B21A8' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
        <div >
    
      <div className="row g-3 mt-2">

        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mt-3 position-relative z-n1">
          <TotalSales data={analyticsData}/>
        </div>

        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mt-3 position-relative z-n1">
          <TotalOrders data={analyticsData}/>
        </div>

        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mt-3">
           <AvgOrder data={analyticsData}/>
        </div>

        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mt-3 position-relative z-n1">
           <TopProducts data={analyticsData}/>
        </div>

        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mt-3 position-relative z-n1">
           <TopSellingCounter data={analyticsData}/>
        </div>

        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mt-3">
           <TopSellingColor data={analyticsData}/>
        </div>

        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mt-3 position-relative z-n1">
           <OnlineStoreConversionRate></OnlineStoreConversionRate>
        </div>

        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mt-3 position-relative z-n1">
          <OnlineStoreSession></OnlineStoreSession>
        </div>

        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mt-3 position-relative z-n1">
           <SessionByDevice></SessionByDevice>
        </div>

        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mt-3 position-relative z-n1">
            <SalesMap></SalesMap>
        </div>

        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-4 col-xxl-3 mt-3 position-relative z-n1">
          <TopCustomers data={analyticsData}/>
        </div>

        
      </div>
    </div>
        )}



    </div>
  )
}

export default AnalyticsPage