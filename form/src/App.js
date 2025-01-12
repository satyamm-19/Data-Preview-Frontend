import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // To navigate to the preview screen
import { useDropzone } from "react-dropzone";

function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const navigate = useNavigate();

  // Drag and drop functionality
  const onDrop = (acceptedFiles) => {
    setAcceptedFiles(acceptedFiles);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  // Convert image to Base64 and store data
  const onSubmit = async (data) => {
    // Convert image to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;

      // Create the formData object and include the Base64 image
      const formData = {
        ...data,
        image: base64Image, // Store the image as a Base64 string
      };

      // Save the data to localStorage (temporary storage)
      localStorage.setItem("userData", JSON.stringify(formData));

      // Redirect to the preview screen
      navigate("/preview");
    };

    if (acceptedFiles[0]) {
      reader.readAsDataURL(acceptedFiles[0]); // Convert image to Base64
    } else {
      alert("Please upload an image.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          {...register("phone", { required: "Phone number is required" })}
        />
        {errors.phone && <p>{errors.phone.message}</p>}
      </div>

      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>{isDragActive ? "Drop the image here..." : "Drag and drop an image here, or click to select"}</p>
      </div>

      {acceptedFiles.length > 0 && <p>Uploaded image: {acceptedFiles[0].name}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}

export default App;
