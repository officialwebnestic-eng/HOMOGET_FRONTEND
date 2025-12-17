import { useState, useMemo, useCallback } from 'react';
import { http } from '../axios/axios';

const Test = ({ number = 0 }) => {

  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [count, setCount] = useState(0);
  const squaredNumber = useMemo(() => {
    console.log("Calculating square...");
    return number * number;

  }, [number]);


  const handleFileChange = useCallback((e) => {
    setFile(e.target.files[0]);
    setFileUrl(null);
    setErrorMessage('');
  }, []);



  const handleUpload = useCallback(async () => {
    if (!file) {
      setErrorMessage("Please select a file first.");
      return;
    }
    setLoading(true);
    try {
      const res = await http.get(`/putawsimage?fileType=${encodeURIComponent(file.type)}`);
      const { url, s3Url } = res.data;
      const upload = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (upload.ok) {
        console.log("✅ File uploaded to:", s3Url);
        setFileUrl(s3Url);
        setErrorMessage('');
      } else {
        const errorText = await upload.text();
        console.error("❌ Upload failed:", errorText);
        setErrorMessage("Upload failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Error uploading file:", err);
      setErrorMessage("Something went wrong during upload.");
    } finally {
      setLoading(false);
    }
  }, [file]);

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Upload Image to S3</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full px-4 py-2 bg-blue-600 text-white rounded ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
        }`}
      >
        {loading ? 'Uploading...' : 'Upload'}

      </button>

      {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}

      {fileUrl && (
        <div className="mt-4">
          <p className="text-green-600 font-medium mb-2">Uploaded Image:</p>
          <img src={fileUrl} alt="Uploaded" className="w-full h-auto rounded border" />
        </div>
      )}
      <div className="mt-6 p-4 border rounded bg-gray-100">
        <p className="mb-2">📐 Squared: <strong>{squaredNumber}</strong></p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => setCount(count + 1)}
        >
          Render ({count})
        </button>
      </div>
    </div>
  );
};

export default Test;
