import React ,{useState}from 'react'
import { useSpinnerDyers } from '../../../components/Context/SpinnersAndDyersContext'
import { useLocation } from 'react-router-dom'
import "./SettingPage.css"

const SettingPage = () => {

    const {state} = useLocation

    const {data,setData} = useSpinnerDyers ()

    const customer = state?.index !== undefined ? data[state.index] : null;

    const [formData, setFormData] = useState({
        name: customer?.name || "",
        storePhone: customer?.storePhone || "",
        buusinessName: customer?.buusinessName || "",
        email: customer?.email || "",
        company: customer?.company || "",
        gstin: customer?.gstin || "",
        chequePhoto: null,
        address: customer?.address || "",
        apartment: customer?.apartment || "",
        country: customer?.country || "",
        state: customer?.state || "",
        city: customer?.city || "",
        pinCode: customer?.pinCode || "",
        timeZone:customer?.timeZone || "",
      });
    


      const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
          ...formData,
          [name]: files ? files[0] : value, // Handle file input separately
        });
      };
    


  return (
    <div className='setting-page'>
        <div className='top'>
            <h5>Store settings</h5>
            
        </div>


        <div>

           
        <div className='setting-inputs rounded row bg-white p-3 gy-2 mt-2'>
            <h6>Store details</h6>

            <div className="col-md-6 d-flex flex-column">
                <label>Store Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>Store Phone</label>
                <input type="text" name="storePhone" value={formData.storePhone} onChange={handleChange} />
            </div>

            <div className="col-md-12 d-flex flex-column">
                <label>Legal buisness name</label> 
                <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} />
            </div>

            <div className="col-md-12 d-flex flex-column">
                <label>Store Email</label>
                <input type="text" name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>Company</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>GSTIN No.</label>
                <input
                className="fs-6 ps-2"
                type="text"
                name="gstin"
                value={formData.gstin}
                placeholder="Add GSTIN No. to authenticate"
                onChange={handleChange}
                />
            </div>

            <div className="media-input-ctn mt-5 p-2 col-md-12">
                <div className="media-input d-flex flex-column justify-content-center align-items-center py-5">
                <input type="file" name="chequePhoto" onChange={handleChange} />
                <h4>Add photo of a business PAN</h4>
                </div>
            </div>

            <div className="col-md-12 d-flex flex-column">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="col-md-12 d-flex flex-column">
                <label>Apartment, Suite, etc.</label>
                <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>Country/Region</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} />
            </div>

            <div className="col-md-6 d-flex flex-column">
                <label>PIN code</label>
                <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} />
            </div>

            <div className="col-md-12 d-flex flex-column">
                <label>Time Zone</label>
                <input type="text" name="pinCode" value={formData.timeZone} onChange={handleChange} />
            </div>



            </div>
        </div>


    </div>
  )
}

export default SettingPage