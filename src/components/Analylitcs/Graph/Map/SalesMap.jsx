import React from "react";
import DatamapsIndia from "react-datamaps-india";
import "./SalesMap.css"

const SalesMap = () => {
  return (
    <div  className="sales-map p-3">
        <h4>Sales Demography</h4>
        <h3>7,259</h3>

    <div
        style={{
          position: "relative",  // Corrected the typo here
          left: "0",
          height: "45vh", // Add height or adjust as needed
          width: "100%", // Add width or adjust as needed
        }}
      >
      <DatamapsIndia
        style={{ postion: "relative", left: "25%" }}
        regionData={{
          "Andaman & Nicobar Island": {
            value: 150
          },
          "Andhra Pradesh": {
            value: 470
          },
          "Arunanchal Pradesh": {
            value: 248
          },
          Assam: {
            value: 528
          },
          Bihar: {
            value: 755
          },
          Chandigarh: {
            value: 95
          },
          Chhattisgarh: {
            value: 1700
          },
          Delhi: {
            value: 1823
          },
          Goa: {
            value: 508
          },
          Gujarat: {
            value: 624
          },
          Haryana: {
            value: 1244
          },
          "Himachal Pradesh": {
            value: 640
          },
          "Jammu & Kashmir": {
            value: 566
          },
          Jharkhand: {
            value: 814
          },
          Karnataka: {
            value: 2482
          },
          Kerala: {
            value: 899
          },
          Lakshadweep: {
            value: 15
          },
          "Madhya Pradesh": {
            value: 1176
          },
          Maharashtra: {
            value: 727
          },
          Manipur: {
            value: 314
          },
          Meghalaya: {
            value: 273
          },
          Mizoram: {
            value: 306
          },
          Nagaland: {
            value: 374
          },
          Odisha: {
            value: 395
          },
          Puducherry: {
            value: 245
          },
          Punjab: {
            value: 786
          },
          Rajasthan: {
            value: 1819
          },
          Sikkim: {
            value: 152
          },
          "Tamil Nadu": {
            value: 2296
          },
          Telangana: {
            value: 467
          },
          Tripura: {
            value: 194
          },
          "Uttar Pradesh": {
            value: 2944
          },
          Uttarakhand: {
            value: 1439
          },
          "West Bengal": {
            value: 1321
          }
        }}
        hoverComponent={({ value }) => {
          return (
            <div>
              <div>
                {value.name} {value.value}
              </div>
            </div>
          );
        }}
        mapLayout={{
        //   title: "State in India",
          legendTitle: "Number of Sells",
          startColor: "#b3d1ff",
          endColor: "#005ce6",
          hoverTitle: "Count",
          noDataColor: "#f5f5f5",
          borderColor: "#8D8D8D",
          hoverColor: "blue",
          hoverBorderColor: "green",
          height: 10,
          weight: 30
        }}
      />
    </div>
    </div>
  );
};

export default SalesMap;
