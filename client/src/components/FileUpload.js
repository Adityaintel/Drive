import { useState } from "react";
import axios from "axios";
import html2canvas from 'html2canvas';
import "./FileUpload.css";

let fileUrl=""
const FileUpload = ({ contract, account, provider }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    diagnosis: ""
  });
  //const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      await axios.post("http://localhost:3001/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // ...
    } catch (e) {
      console.log(e);
      alert("Unable to upload form data");
    }
    

  let patientForm = document.querySelector("#patient-form");
  if (!patientForm) {
    console.error("Element with ID 'patient-form' not found");
    return;
  }
  console.log(formData);

  const canvas = await html2canvas(document.querySelector("#patient-form"));
  const dataUrl = canvas.toDataURL("image/jpeg");
  const blob = dataURItoBlob(dataUrl);

  try {
    const formData = new FormData();
    formData.append("file", blob, "patient-form.jpg");

    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        pinata_api_key: `34ebd186809a7e3a50a2`,
        pinata_secret_api_key: `1b49283abe7a6067b76e6d34e96a5a87135e1d98eb98e9b05647db46b47fb762`,
        "Content-Type": "multipart/form-data",
      },
    });
    fileUrl = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
    const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
    //const signer = contract.connect(provider.getSigner());
    const signer = contract.connect(provider.getSigner());
    signer.add(account, ImgHash);
    alert("Successfully Image Uploaded");
    setFileName("No image selected");
    setFile(null);
  } catch (e) {
    console.log(e);
    alert("Unable to upload image to Pinata");
  }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" });
  };
  return (
    <div className="top" id="patient-form">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input type="text" id="firstName" name="firstName" required value={formData.firstName}
            onChange={handleChange}/>
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input type="text" id="lastName" name="lastName" required value={formData.lastName}
            onChange={handleChange}/>
        </div>
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input type="number" id="age" name="age" required value={formData.age}
            onChange={handleChange}/>
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select id="gender" name="gender" requiredvalue={formData.gender}
            onChange={handleChange}>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="diagnosis">Diagnosis:</label>
          <textarea id="diagnosis" name="diagnosis" required value={formData.diagnosis}
            onChange={handleChange}></textarea>
        </div>
        <button type="submit" className="submit">
          Submit
        </button>
      </form>
      {fileUrl && (
        <div className="image-preview">
          <img src={fileUrl} alt="Patient form" />
        </div>
      )}
    </div>
  );
      }
export default FileUpload;