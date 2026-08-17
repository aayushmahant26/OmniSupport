/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { documentApi } from '../../api/documentApi';
import { ArrowLeft } from 'lucide-react';
import DocumentUploadForm from './components/DocumentUploadForm';
import DocumentList from './components/DocumentList';

export const UploadDocumentPage = () => {
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Feedback states
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentApi.listDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => { // This is used to handle the file change event.
    if (e.target.files && e.target.files[0]) { // Make sure files exists AND the first file exists before trying to use it. This prevents errors such as trying to access a file when nothing was selected.
      const file = e.target.files[0];
      setSelectedFile(file);
      // Auto fill title with file name without extension if title is blank
      if (!title) { // checks the title of the document. if it is blank, it will fill the title with the file name without the extension.
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name; // This is used to get the file name without the extension.
        setTitle(nameWithoutExt); // This is used to set the title of the document.
      }
    }
  };

  // This is used to programmatically open the file picker when the user clicks your custom button.
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // This is used to handle the file upload submission event.
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!selectedFile) {
      setErrorMsg('Please select a file to upload.');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('Please enter a document title.');
      return;
    }

    setUploading(true);
    try {
      await documentApi.uploadDocument(title, selectedFile);
      setSuccessMsg(`Document "${title}" uploaded and processed into vector database!`);
      setTitle(''); // After successfull upload, it will reset the title to empty.
      setSelectedFile(null); // After successfull upload, it will reset the selected file to null.
      if (fileInputRef.current) fileInputRef.current.value = ''; // After successfull upload, it will reset the file input value to empty.

      // Refresh documents list
      await fetchDocuments(); // This is used to refresh the documents list after uploading a new file in DB.
    } catch (err) {
      console.error('Upload error', err); // If an error occurs during the upload process, log it to the console.
      setErrorMsg(err.response?.data?.detail || 'Failed to upload document. Please ensure it is a PDF or Text file.'); // Sets the error message to be displayed to the user.
    } finally {
      setUploading(false); // Sets the uploading state to false.
    }
  };

  // This is used to delete a document.
  const handleDelete = async (documentId, docTitle) => {
    if (!window.confirm(`Are you sure you want to delete the document "${docTitle}"? This will remove all associated AI chunks and vector embeddings.`)) { // Checks if the user wants to delete the document.
      return; // If the user does not want to delete the document, return.
    }

    try {
      await documentApi.deleteDocument(documentId); // Calls the deleteDocument API endpoint.
      setSuccessMsg(`Deleted document: "${docTitle}"`);
      await fetchDocuments(); // Updates the list of documents after deletion.
    } catch (err) {
      console.error('Delete error', err);
      setErrorMsg('Failed to delete document.');
    }
  };

  // This is used to format the file size.
  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 Bytes'; // This checks whether bytes is a falsy value (0, null, undefined, etc). If it is, it will return '0 Bytes'.
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Knowledge Base Manager</h1>
          <p className="text-textSecondary text-sm mt-1">Feed PDF and Text documents to train the AI customer support chatbot</p>
        </div>
        <div>
          <Link
            to="/company/dashboard"
            className="inline-flex items-center justify-center gap-2 font-semibold text-sm py-2.5 px-5 rounded-md cursor-pointer transition-all duration-150 text-center bg-bgSurfaceElevated border border-borderColor text-textPrimary hover:bg-bgSurfaceHover"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 items-start">
        {/* Upload Form Component */}
        {/* Passing the props to the DocumentUploadForm component. */}
        <DocumentUploadForm
          title={title}
          setTitle={setTitle}
          selectedFile={selectedFile}
          uploading={uploading}
          successMsg={successMsg}
          errorMsg={errorMsg}
          onSubmit={handleUploadSubmit}
          fileInputRef={fileInputRef}
          triggerFileSelect={triggerFileSelect}
          handleFileChange={handleFileChange}
          formatBytes={formatBytes}
        />

        {/* Documents List Component */}
        <DocumentList
          documents={documents}
          loading={loading}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default UploadDocumentPage;
