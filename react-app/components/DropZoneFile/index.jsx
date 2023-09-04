import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-regular-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons';;
import './styles.css';

const DropZoneFile = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Define a callback function for handling file uploads
  const onDrop = useCallback((acceptedFiles) => {
    // Create a FormData object to send the file to the server
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      console.log('files', file);
      // formData.append('file', file);
      const reader = new FileReader();

      // Define the callback function to run when the file is loaded
      reader.onload = (event) => {
        //const img = document.createElement('img');
        //img.className = 'preview-image';
        //img.src = event.target.result;
        //previewContainer.appendChild(img);
        console.log(event.target.result);
      };

      // Read the file as a data URL (this will trigger the onload callback)
      reader.readAsDataURL(file);
    });


    console.log('files: ', formData);

    // Send the file to the server using Axios or your preferred HTTP library
    /*axios.post('/upload', formData).then((response) => {
      // Handle the response from the server
      console.log('File uploaded successfully!', response.data);
      setUploadedFiles(response.data); // You can store uploaded files in state
    }); */
  }, []);

  // Use the useDropzone hook to create a drop zone area
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="file-uploader">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <p>Drag & drop files here, or click to select files</p>
        <FontAwesomeIcon icon={faFileImage}  style={{ fontSize: '50px', color: '#007bff' }} />
      </div>
      <div>
        {uploadedFiles.map((file, index) => (
          <div key={index}>
            <p>{file.name}</p>
            <img src={file.url} alt={file.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropZoneFile;

