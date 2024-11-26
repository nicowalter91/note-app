import React, { useState, useEffect } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import ImageUpload from '../../components/FileUpload/FileUpload';  // Bild-Upload-Komponente importieren

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [file, setFile] = useState(null);  // Zustand für das Bild
  const [imageUrl, setImageUrl] = useState(noteData?.imageUrl || null);  // Zustand für die Bild-URL
  const [error, setError] = useState(null);

  // Wenn wir im Editiermodus sind, wird die URL des Bildes gesetzt
 useEffect(() => {
  setTitle(noteData?.title || "");
  setContent(noteData?.content || "");
  setTags(noteData?.tags || []);
  setImageUrl(noteData?.imageUrl || null);
}, [noteData]);  // Der Hook wird immer ausgeführt, wenn sich `noteData` ändert


  // Add Note
  const addNewNote = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    if (file) {
      formData.append("image", file);  // Die Datei hinzufügen, wenn sie existiert
    }

    try {
      const response = await axiosInstance.post("/add-note", formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // Wichtig für Dateiupload
        },
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  // Edit Note
  const editNote = async () => {
    const noteId = noteData._id;
    const formData = new FormData();
    
    // Wenn Titel oder Inhalt geändert wurden, die neuen Werte anhängen
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    // Wenn ein neues Bild hochgeladen wurde, fügen wir es hinzu
    if (file) {
      formData.append("image", file);  // Die Datei hinzufügen, wenn sie existiert
    } else if (!file && imageUrl) {
      // Wenn kein neues Bild, aber ein altes Bild vorhanden ist, die URL weitergeben
      formData.append("imageUrl", imageUrl);  
    }

    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // Wichtig für Dateiupload
        },
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Please insert title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      {/* Wenn im Editiermodus ein Bild existiert, zeige das Bild und nicht den Upload-Input */}
      <div>
        {imageUrl ? (
          <div className="relative w-full max-w-md mt-5">
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-full h-auto object-contain rounded-lg shadow-lg"
            />
            {/* Optional: Button um das Bild zu löschen */}
            <button
              onClick={() => setImageUrl(null)}  // Bild löschen (setzt URL auf null)
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-lg text-red-500 hover:bg-gray-200"
            >
              <MdClose size={20} />
            </button>
          </div>
        ) : (
          <ImageUpload setFile={setFile} />  
        )}
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button className="btn-primary font-medium text-xs mt-5 p-3" onClick={handleAddNote}>
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
