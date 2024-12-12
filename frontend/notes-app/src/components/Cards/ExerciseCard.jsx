import React from "react";
import { MdCreate, MdDelete } from "react-icons/md";
import { FaRegHeart, FaHeart, FaPlusCircle } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { IoPeopleOutline } from "react-icons/io5";

const ExerciseCard = ({
  title,
  organisation,
  durchfuehrung,
  coaching,
  variante,
  isPinnedExercise,
  onEdit,
  onDelete,
  onPinExercise,
  imageUrl,
  duration,
  players,
  category,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-out flex flex-col justify-between h-full">
      {/* Flex-Container für die obere Zeile der Notizkarte (Titel und Datum) */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            {/* Titel der Notiz */}
            <h6 className="text-xl font-medium">{title}</h6>
            <div className="flex items-center gap-1">
              <IoMdTime className="text-lg text-blue-600" />
              <span className="text-xs text-slate-500">{duration} min</span>
              {/* Spieleranzahl */}
              <IoPeopleOutline className="text-lg text-blue-600 ml-5" />
              <span className="text-xs text-slate-500">
                {players ? `${players} Spieler` : "Keine Spieler angegeben"}
              </span>
            </div>
          </div>

          {/* Pin-Icon, das auf den Status "isPinned" reagiert */}
          {isPinnedExercise ? (
            <FaHeart
              className="icon-btn text-primary"
              onClick={onPinExercise}
            />
          ) : (
            <FaRegHeart
              className="icon-btn text-slate-300"
              onClick={onPinExercise}
            />
          )}
        </div>

        {/* Bild unter Titel und Datum */}
        <div className="relative">
          {imageUrl ? (
            <img
              src={`http://localhost:8000${imageUrl}`}
              alt={title}
              className="w-full h-auto rounded mt-2 mb-5"
            />
          ) : (
            <div
              className="w-full h-auto bg-gray-300 rounded mt-2 mb-5 flex items-center justify-center"
              style={{ aspectRatio: "4/3" }} // Optional: Standard-Seitenverhältnis wie 16:9
            >
              <span className="text-gray-700 text-sm">No image available</span>
            </div>
          )}

          {/* Kategorien über dem Bild (unten links) */}
          <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-3 py-1 rounded shadow">
            {category}
          </div>
        </div>

        {/* Vorschau des Inhalts der Notiz */}
        <label className="input-label">ORGANISATION</label>
        <p className="text-xs text-slate-600 mt-2">
          {organisation?.slice(0, 120)}
        </p>
        <label className="input-label">DURCHFÜHRUNG</label>
        <p className="text-xs text-slate-600 mt-2">
          {durchfuehrung?.slice(0, 120)}
        </p>
        <label className="input-label">COACHING</label>
        <p className="text-xs text-slate-600 mt-2">{coaching?.slice(0, 120)}</p>
        <label className="input-label">VARIANTE</label>
        <p className="text-xs text-slate-600 mt-2">{variante?.slice(0, 120)}</p>
      </div>

      {/*Buttons für Bearbeiten und Löschen */}
      <div className="flex justify-between items-center mt-5">
        {/* Plus-Symbol links -- Hier soll später das hinzufügen der Übung zum Training erfolgen*/}
        <FaPlusCircle className="icon-btn hover:text-blue-600" />

        {/* Edit- und Delete-Symbole rechts */}
        <div className="flex gap-2">
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={onEdit}
          />
          <MdDelete
            className="icon-btn hover:text-red-500"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
