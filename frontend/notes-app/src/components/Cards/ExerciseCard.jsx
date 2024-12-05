import React from 'react';
import moment from 'moment';
import { MdOutlinePushPin } from 'react-icons/md';
import { MdCreate, MdDelete } from 'react-icons/md';
import Image from "../../assets/img/Test.png";

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
    imageUrl 
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
                    <MdOutlinePushPin
                        className={`icon-btn ${isPinnedExercise ? 'text-primary' : 'text-slate-300'}`}
                        onClick={onPinExercise}
                    />
                </div>

                {/* Bild unter Titel und Datum */}
                <img src={Image} alt={title} className="w-full h-auto rounded mt-2" />

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

            {/* Tags der Notiz und Buttons für Bearbeiten und Löschen */}
            <div className="flex justify-end items-end mt-auto gap-2">
                <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit} />
                <MdDelete className="icon-btn hover:text-red-500" onClick={onDelete} />
            </div>
        </div>
    );
}

export default ExerciseCard;
