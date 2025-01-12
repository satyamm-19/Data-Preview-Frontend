import React, { useState } from "react";
import { Form, useForm } from "react-hook-form";
import "./App.css";
import { useDropzone } from "react-dropzone";
function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);

  const onDrop = (acceptedFiles, rejectedFiles) => {
    setAcceptedFiles((prev) => [...prev, ...acceptedFiles]);
    setFileErrors(rejectedFiles);
    console.log(acceptedFiles);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png", ".jpg"],
      "video/*": [".mp4", ".avi", ".mov"],
    },
    onDrop,
  });



  const validateFiles = () => {
    if (acceptedFiles.length === 0) return "At least one file is required.";
    if (acceptedFiles.some((file) => file.size > 5 * 1024 * 1024)) return "Each file must be less than 5MB.";
    return true;
  };



  async function onSubmit(data) {
    await new Promise((r) => setTimeout(r, 2000));


    const fileValidationResult = validateFiles();
    if (fileValidationResult !== true) {
      alert(fileValidationResult);
      return;
    }

    
    
    
    const payload = {
      ...data,
      files: acceptedFiles.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })),
    };
  localStorage.setItem("userFormData", JSON.stringify(payload));
  console.log("Data saved to local storage:", payload);
  try {
      const response=await fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Data sent to the backend successfully!");
    } catch (error) {
      console.error("Error sending data to the backend:", error);
    }
  }
  






  const removeFile = (index) => {
    setAcceptedFiles((files) => files.filter((_, i) => i !== index));
  };
  const clearErrors = () => {
    setFileErrors([]);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label> Name: </label>
        <input
          className={errors.name ? "input-error" : ""}
          type="text"
          {...register("name", {
            required: true,
            pattern: { value: /^[A-Za-z\s]+$/, message: "Name is not valid" },
            minLength: { value: 3, message: "Min Length 3" },
            maxLength: { value: 30, message: "Max Length 30" },
          })}
        />
        {errors.name && <p className="error-msg">{errors.name.message}</p>}
      </div>
      <div>
        <label> Phone Number: </label>
        <input
          className={errors.numb ? "input-error" : ""}
          type="text"
          {...register("numb", {
            required: true,
            pattern: { value: /^[0-9]+$/, message: "Number is not valid" },
            minLength: { value: 10, message: "Number is not valid" },
            maxLength: { value: 11, message: "Number is not valid" },
          })}
        />
        {errors.numb && <p className="error-msg">{errors.numb.message}</p>}
      </div>
      <br />
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${
            isDragActive ? "#8FB0CE" : fileErrors.length > 0 ? "red" : "white"
          }`,
          // borderColor:'white',
          padding: "20px",
          margin: "10px 0",
          backgroundColor: isDragActive
            ? "#8FB0CE"
            : fileErrors.length > 0
            ? "red"
            : "rgba(0, 0, 0, 0.1)",
          minWidth: "400px",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <p>
          {isDragActive
            ? "Drop the files here..."
            : "Drag and drop images or videos here, or click to select files."}
        </p>
        {/* <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            getRootProps().onClick(e);
          }}
          style={{ marginTop: "10px" }}
          className="btn"
        >
          Choose File
        </button> */}
      </div>

      {acceptedFiles.length > 0 && (
        <div style={{ margin: "10px 0" }}>
          <h4>Accepted Files:</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {acceptedFiles.map((file, index) => (
              <li
                key={index}
                style={{
                  color: "#333",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "5px",
                  backgroundColor: "#f0f9ff",
                  marginBottom: "5px",
                  borderRadius: "4px",
                }}
              >
                <span>{file.name}</span>
                <button
                  className="btn"
                  type="button"
                  onClick={() => removeFile(index)}
                  style={{ color: "red" }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {fileErrors.length > 0 && (
        <div style={{ margin: "10px 0" }}>
          <h4 style={{ color: "red" }}>Rejected Files:</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {fileErrors.map((error, index) => (
              <li
                key={index}
                style={{
                  padding: "5px",
                  backgroundColor: "#fff5f5",
                  marginBottom: "5px",
                  borderRadius: "4px",
                  color: "red",
                }}
              >
                <div>{error.file.name}</div>
                <div style={{ fontSize: "0.8em" }}>
                  {error.errors.map((e) => e.message).join(", ")}
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={clearErrors}
            className="btn"
            style={{
              color: "red",
            }}
          >
            Clear errors
          </button>
        </div>
      )}

      <br />
      <input
        type="submit"
        disabled={isSubmitting}
        value={isSubmitting ? "Submitting" : "Submit"}
        style={{ width: "120px" }}
        className="btn"
      />
    </form>
  );
}

export default App;
