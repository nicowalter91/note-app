import React, { useRef, useState } from 'react'
import '../../components/FileUpload/FileUpload.css';
import { FaCloudUploadAlt } from 'react-icons/fa';

const FileUpload = () => {

  const inputRef = useRef();

  // State variables for tracking file-related information
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("select");

  // Handle file change event
  const handleFileChange = (event) => {
    if (event.target.file && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Function to trigger file input dialog
  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div>
      {/* File input element with a reference */}
      <input 
        ref={inputRef}
        type='file'
        onChange={handleFileChange}
        style={{display: "none"}}
      />

       {/* Button to trigger the file input dialog */}
       {!selectedFile && (
         <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded flex items-center" onClick={onChooseFile}> 
         <FaCloudUploadAlt className="mr-2" />
         Upload
       </button>
       )}
  
  </div>
  )
};

export default FileUpload
