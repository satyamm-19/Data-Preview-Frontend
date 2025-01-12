import React from "react";
import { useNavigate } from "react-router-dom";

function Preview() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();

  const submitDataToBackend = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        alert("Data submitted successfully!");
        localStorage.removeItem("userData");
        navigate("/success"); // Redirect to a success page after submission
      } else {
        throw new Error("Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data. Please try again.");
    }
  };

  return (
    <div>
      <h1>Preview Your Data</h1>
      <p><strong>Name:</strong> {userData.name}</p>
      <p><strong>Phone Number:</strong> {userData.phone}</p>
      <p><strong>Image:</strong> 
        {userData.image ? <img src={userData.image} alt="Preview" width={100} /> : "No image uploaded"}
      </p>

      <button onClick={submitDataToBackend}>Submit to Database</button>
    </div>
  );
}

export default Preview;
