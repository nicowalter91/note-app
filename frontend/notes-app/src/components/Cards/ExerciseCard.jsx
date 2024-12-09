import React from 'react';
import moment from 'moment';
import { MdCreate, MdDelete } from 'react-icons/md';
import { FaRegHeart, FaHeart, FaPlusCircle } from "react-icons/fa";




const ExerciseCard = ({
    title,
    date,
    organisation,
    durchfuehrung,
    coaching,
    variante,
    isPinnedExercise,
    onEdit,
    onDelete,
    onPinExercise,
    imageUrl,



}) => {
    return (
        <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-out flex flex-col justify-between h-full'>
            {/* Flex-Container für die obere Zeile der Notizkarte (Titel und Datum) */}
            <div>
                <div className='flex items-center justify-between'>
                    <div>
                        {/* Titel der Notiz */}
                        <h6 className='text-xl font-medium'>{title}</h6>
                        {/* Formatiertes Datum */}
                        <span className='text-xs text-slate-500'>
                            {moment(date).format('DD.MM.YYYY')}
                        </span>
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

                <img src={`http://localhost:8000${imageUrl}`} alt={title} className="w-full h-auto rounded mt-2" />

                {/* Vorschau des Inhalts der Notiz */}
                <label className="input-label">ORGANISATION</label>
                <p className="text-xs text-slate-600 mt-2">{organisation?.slice(0, 120)}</p>
                <label className="input-label">DURCHFÜHRUNG</label>
                <p className="text-xs text-slate-600 mt-2">{durchfuehrung?.slice(0, 120)}</p>
                <label className="input-label">COACHING</label>
                <p className="text-xs text-slate-600 mt-2">{coaching?.slice(0, 120)}</p>
                <label className="input-label">VARIANTE</label>
                <p className="text-xs text-slate-600 mt-2">{variante?.slice(0, 120)}</p>
            </div>



            {/*Buttons für Bearbeiten und Löschen */}
            <div className="flex justify-between items-center mt-auto">
                {/* Plus-Symbol links -- Hier soll später das hinzufügen der Übung zum Training erfolgen*/}
                <FaPlusCircle className="icon-btn hover:text-blue-600" />  

                {/* Edit- und Delete-Symbole rechts */}
                <div className="flex gap-2">
                    <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit} />
                    <MdDelete className="icon-btn hover:text-red-500" onClick={onDelete} />
                </div>
            </div>

        </div>
    );
}

export default ExerciseCard;
