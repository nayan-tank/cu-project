import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartsDashboard = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [revenueData, setRevenueData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [yearlyOrdersData, setYearlyOrdersData] = useState([]);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingYearlyOrders, setLoadingYearlyOrders] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  const years = Array.from({ length: 2 }, (_, i) => currentYear - i);
  const allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const labels =
    selectedYear == currentYear
      ? allMonths.slice(0, currentMonth + 1)
      : allMonths;

  // Fetch revenue data
  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoadingRevenue(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/admin/orders/revenue/${selectedYear}`,
          { withCredentials: true }
        );
        const monthWiseRevenue = Array(12).fill(0);
        response.data.forEach((item) => {
          monthWiseRevenue[item._id - 1] = item.totalRevenue;
        });
        setRevenueData(monthWiseRevenue);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setLoadingRevenue(false);
      }
    };

    fetchRevenueData();
  }, [selectedYear]);

  // Fetch monthly orders data
  useEffect(() => {
    const fetchOrdersData = async () => {
      setLoadingOrders(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/admin/orders/get`,
          { withCredentials: true }
        );

        const orders = response.data;

        // Get total count of orders
        const totalOrdersCount = orders.data.length; // Assuming `orders.data` is an array of orders
        // console.log(totalOrdersCount);
        // Set total count
        setOrdersData(totalOrdersCount);
      } catch (error) {
        console.error("Error fetching orders data:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrdersData();
  }, []);

  // Fetch yearly orders data
  useEffect(() => {
    const fetchYearlyOrdersData = async () => {
      setLoadingYearlyOrders(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/admin/orders/get/${selectedYear}`,
          { withCredentials: true }
        );
        const yearlyData = response.data.map((item) => ({
          year: item._id,
          count: item.orderCount,
        }));
        setYearlyOrdersData(yearlyData);
      } catch (error) {
        console.error("Error fetching yearly orders data:", error);
      } finally {
        setLoadingYearlyOrders(false);
      }
    };

    fetchYearlyOrdersData();
  }, []);

  const revenueChartData = {
    labels,
    datasets: [
      {
        label: `Monthly Sell (₹) - ${selectedYear}`,
        data: labels.map((_, i) => revenueData[i] || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const yearlyOrdersChartData = {
    labels: yearlyOrdersData.map((item) => item.year),
    datasets: [
      {
        label: "Yearly Orders",
        data: yearlyOrdersData.map((item) => item.count),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { font: { size: 10 } } },
      y: { ticks: { font: { size: 10 } } },
    },
  };

  return (
    <>
      <div className="p-5">
        <div
        className="flex lg:text-[17px] text-sm"
        >
          <h2 className="font-bold p-2">Dashboard Overview</h2>
          {/* year-select */}
          <div className="mb-5 p-0">
            {/* <label 
            className="ml-4"
            htmlFor="year-select">Year:</label> */}
            <select
              className="text-[3px]"
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            >
              {years.map((year) => (
                <option 
                className="text-[12px]"
                key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          }}
        >
          {/* Revenue Data */}
          <div
            style={{
              background: "#fff",
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              minHeight: "250px",
            }}
          >
            {loadingRevenue ? (
              <p>Loading Revenue Data...</p>
            ) : (
              <Bar data={revenueChartData} options={chartOptions} />
            )}
          </div>

          {/* Orders Data */}
          <div
            style={{
              background: "#fff",
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              minHeight: "250px",
            }}
          >
            {loadingYearlyOrders ? (
              <p>Loading Yearly Orders Data...</p>
            ) : (
              <Line data={yearlyOrdersChartData} options={chartOptions} />
            )}
          </div>


          {/* Revenue */}
          <div
             style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center", // Center align items horizontally
              height: "250px",
            }}
          >
            <h3
              style={{
                fontSize: "1rem", // Smaller size for text
                margin: "0", // Remove margins
                color: "#666", // Subtle color for the text
                fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
              }}
            >
              Revenue (₹) 
            </h3>
            {loadingOrders ? (
              <p>Loading...</p>
            ) : (
              <p
              style={{
                fontSize: "3.5rem", // Larger size for number
                fontWeight: "bold",
                margin: "-5px 0 0 0", // Add margin only to the top
                color: "#48D1CC", // Highlight color for the number
              }}
            >
                {revenueData.reduce((acc, curr) => acc + curr, 0)}
              </p>
            )}
          </div>

          {/* Total Orders */}
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center", // Center align items horizontally
              height: "250px",
            }}
          >
            <p
              style={{
                fontSize: "1rem", // Smaller size for text
                margin: "0", // Remove margins
                color: "#666", // Subtle color for the text
                fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
              }}
            >
              Total Orders
            </p>
            {loadingOrders ? (
              <p>Loading...</p>
            ) : (
              <p
                style={{
                  fontSize: "3.5rem", // Larger size for number
                  fontWeight: "bold",
                  margin: "-5px 0 0 0", // Add margin only to the top
                  color: "#48D1CC", // Highlight color for the number
                }}
              >
                {ordersData>0? ordersData: 0}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChartsDashboard;
