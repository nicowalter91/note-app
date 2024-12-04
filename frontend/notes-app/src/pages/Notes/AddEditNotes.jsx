import React, { useState } from 'react'
import TagInput from '../../components/Input/TagInput'  // TagInput-Komponente zum Hinzufügen von Tags
import { MdClose } from 'react-icons/md'  // Close-Icon zum Schließen der Notizansicht
import axiosInstance from '../../utils/axiosInstance';  // Axios-Instanz für API-Anfragen

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
  // Zustand für die Notiz-Daten (Titel, Inhalt, Tags)
  const [title, setTitle] = useState(noteData?.title || "");  // Initialisiert den Titel, wenn vorhanden, ansonsten leer
  const [content, setContent] = useState(noteData?.content ||"");  // Initialisiert den Inhalt
  const [tags, setTags] = useState(noteData?.tags ||[]);  // Initialisiert Tags, wenn vorhanden, ansonsten leeres Array

  const [error, setError] = useState(null);  // Zustand für Fehlernachrichten

  // Funktion zum Hinzufügen einer neuen Notiz
  const addNewNote = async () => {
    try {
      // API-Anfrage zum Hinzufügen der Notiz
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags
      });

      // Erfolgsnachricht anzeigen, wenn die Notiz erfolgreich hinzugefügt wurde
      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully");
        getAllNotes();  // Alle Notizen erneut abrufen
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

  // Funktion zum Bearbeiten einer bestehenden Notiz
  const editNote = async () => {
    const noteId = noteData._id  // Notiz-ID für die zu bearbeitende Notiz

    try {
      // API-Anfrage zum Bearbeiten der Notiz
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title,
        content,
        tags
      });

      // Erfolgsnachricht anzeigen, wenn die Notiz erfolgreich aktualisiert wurde
      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();  // Alle Notizen erneut abrufen
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

  // Funktion zum Verarbeiten des "Add Note" bzw. "Edit Note" Buttons
  const handleAddNote = () => {
    // Überprüfen, ob der Titel und der Inhalt ausgefüllt sind
    if(!title) {
      setError("Please enter the title");  // Fehlernachricht anzeigen, wenn kein Titel angegeben wurde
      return;
    }

    if(!content) {
      setError("Please enter the content");  // Fehlernachricht anzeigen, wenn kein Inhalt angegeben wurde
      return;
    }

    setError("");  // Fehlernachricht zurücksetzen, falls alle Felder korrekt ausgefüllt sind

    // Wenn der Modus "edit" ist, wird editNote aufgerufen, andernfalls wird addNewNote aufgerufen
    if(type === "edit") {
      editNote();  // Notiz bearbeiten
    } else {
      addNewNote();  // Neue Notiz hinzufügen
    }
  }

  return (
    <div className='relative'>

      {/* Schaltfläche zum Schließen der Notizansicht */}
      <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50' onClick={onClose}>
        <MdClose className="text-xl text-slate-400" />
      </button>

      {/* Eingabefeld für den Titel */}
      <div className='flex flex-col gap-2'>
        <label className='input-label'>TITLE</label>
        <input 
            type="text"
            className='text-2xl text-slate-950 outline-none'
            placeholder='Please insert title'
            value={title}
            onChange={({target}) => setTitle(target.value)}  // Setzt den Titel, wenn der Benutzer ihn eingibt
        />
      </div>

      {/* Eingabefeld für den Inhalt */}
      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>CONTENT</label>
        <textarea 
            type="text"
            className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
            placeholder='Content'
            rows={10}
            value={content}
            onChange={({target}) => setContent(target.value)}  // Setzt den Inhalt, wenn der Benutzer ihn eingibt
        />
      </div>

      {/* Tag-Eingabefeld */}
      <div className='mt-3'>
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />  {/* Ermöglicht das Hinzufügen von Tags */}
      </div>

      {/* Fehlernachricht anzeigen, wenn ein Fehler aufgetreten ist */}
      {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

      {/* Schaltfläche zum Hinzufügen oder Bearbeiten der Notiz */}
      <button className='btn-primary font-medium text-xs mt-5 p-3' onClick={handleAddNote}>
        {type === 'edit' ? 'UPDATE' :  'ADD'}  {/* Zeigt entweder 'UPDATE' oder 'ADD' je nach Modus */}
      </button>
    </div>
  )
}

export default AddEditNotes
