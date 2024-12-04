import React, { useState } from 'react';
import { MdClose, MdDelete } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import TagInput from '../../components/Input/TagInput'  

const AddEditExercise = ({ exerciseData, type, getAllExercises, onClose, showToastMessage }) => {
  const [title, setTitle] = useState(exerciseData?.title || '');
  const [organisation, setOrganisation] = useState(exerciseData?.organisation || '');
  const [durchfuehrung, setDurchfuehrung] = useState(exerciseData?.durchfuehrung || '');
  const [coaching, setCoaching] = useState(exerciseData?.coaching || '');
  const [variante, setVariante] = useState(exerciseData?.variante || '');
  const [tags, setTags] = useState(exerciseData?.tags || []);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  //** Neue Exercise hinzufügen ***//
  const addNewExercise = async () => {
    try {
      const response = await axiosInstance.post("/add-exercise", {
        title,
        organisation,
        durchfuehrung,
        coaching,
        variante,
        tags
      });
      if (response.data && response.data.exercise) {
        showToastMessage("Exercise Added Successfully");
        getAllExercises();  // Alle Notizen erneut abrufen
        onClose();  // Schließt das Modal/Fenster
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message)
      }
    }
  };

    //** Neue Exercise editieren ***//
    const editExercise = async () => {
      const noteId = exerciseDataData._id 
  
      try {
        // API-Anfrage zum Bearbeiten der Notiz
        const response = await axiosInstance.put("/edit-exercise/" + exerciseId, {
        title,
        organisation,
        durchfuehrung,
        coaching,
        variante,
        tags
        });
  
        // Erfolgsnachricht anzeigen, wenn die Notiz erfolgreich aktualisiert wurde
        if (response.data && response.data.exercise) {
          showToastMessage("Exercise Updated Successfully");
          getAllExercises();  // Alle Notizen erneut abrufen
          onClose();  // Schließt das Modal/Fenster
        }
      } catch (error) {
        // Fehlerbehandlung: Zeigt eine Fehlermeldung an
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setError(error.response.data.message)
        }
      }
    };

  const handleAddExercise = () => {
    if(!title) {
      setError("Please enter the title");
      return;
    }

    if(!organisation) {
      setError("Please enter the organisation");
      return;
    }

    if(!durchfuehrung) {
      setError("Please enter the durchfuehrung");
      return;
    }

    if(!coaching) {
      setError("Please enter the coaching");
      return;
    }

    setError("");

    if(type === "edit") {
      editExercise();
    } else {
      addNewExercise();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
  };



  return (
    <div className="relative mx-auto">
      {/* Close Button */}
      <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50" onClick={onClose}>
        <MdClose className="text-xl text-slate-400" />
      </button>

      {/* Title Input */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none w-full"
          placeholder="Please insert title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Main Content Containers */}
      <div className="grid grid-cols-2 gap-8 mt-4">
        {/* Image Upload */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
          <label className="input-label mb-2">UPLOAD IMAGE</label>
          {image ? (
            <div className="flex flex-col items-center">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-full  object-cover rounded mb-4"
              />
              <button
                className="flex items-center gap-2 text-red-500 text-sm hover:underline"
                onClick={handleImageRemove}
              >
                <MdDelete className="text-lg" />
                Remove Image
              </button>
            </div>
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className="cursor-pointer text-blue-500 underline">
                Choose a file
              </label>
            </>
          )}
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-6">
          {/* Organisation */}
          <div className="flex flex-col gap-2">
            <label className="input-label">ORGANISATION</label>
            <textarea
              rows={4}
              className="text-sm text-slate-950 outline-none bg-slate-50 p-3 rounded w-full"
              placeholder="Describe the organisation setup..."
              value={organisation}
              onChange={({target}) => setOrganisation(target.value)}
            />
          </div>

          {/* Durchführung */}
          <div className="flex flex-col gap-2">
            <label className="input-label">DURCHFÜHRUNG</label>
            <textarea
              rows={4}
              className="text-sm text-slate-950 outline-none bg-slate-50 p-3 rounded w-full"
              placeholder="Describe how the exercise is conducted..."
              value={durchfuehrung}
              onChange={({target}) => setDurchfuehrung(target.value)}
            />
          </div>

          {/* Coaching */}
          <div className="flex flex-col gap-2">
            <label className="input-label">COACHING</label>
            <textarea
              rows={4}
              className="text-sm text-slate-950 outline-none bg-slate-50 p-3 rounded w-full"
              placeholder="Coaching points or instructions..."
              value={coaching}
              onChange={({target}) => setCoaching(target.value)}
            />
          </div>

          {/* Variante */}
          <div className="flex flex-col gap-2">
            <label className="input-label">VARIANTE</label>
            <textarea
              rows={4}
              className="text-sm text-slate-950 outline-none bg-slate-50 p-3 rounded w-full"
              placeholder="Possible variations or adjustments..."
              value={variante}
              onChange={({target}) => setVariante(target.value)}
            />
          </div>
        </div>
      </div>

       {/* Tag-Eingabefeld */}
       <div className='mt-3'>
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />  {/* Ermöglicht das Hinzufügen von Tags */}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      {/* Submit Button */}
      <button className='btn-primary font-medium text-xs mt-5 p-3' onClick={handleAddExercise}>
        {type === 'edit' ? 'UPDATE' :  'ADD'}  {/* Zeigt entweder 'UPDATE' oder 'ADD' je nach Modus */}
      </button>
    </div>
  );
};

export default AddEditExercise;
