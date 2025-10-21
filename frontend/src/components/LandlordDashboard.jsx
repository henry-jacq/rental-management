import React, { useEffect, useState } from "react";
import axios from "axios";

const LandlordDashboard = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard/landlord", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(res.data.message);
      } catch (err) {
        setMessage(err.response?.data?.msg || "Error fetching data");
      }
    };
    fetchData();
  }, []);

  return <div style={{ padding: "20px" }}><h2>Landlord Dashboard</h2><p>{message}</p></div>;
};

export default LandlordDashboard;
