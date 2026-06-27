import React, { useState } from 'react';
import { Tarea } from './types';

interface TareasProps {
    tareas: Tarea[];
    onAddTarea?: (nombre: string, descripcion: string) => void;
    onCompletarTarea?: (id: string) => void;
}

export default function Tareas({ tareas, onAddTarea, onCompletarTarea }: TareasProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const handleSave = () => {
        if (nombre.trim() && descripcion.trim() && onAddTarea) {
            onAddTarea(nombre, descripcion);
            setNombre('');
            setDescripcion('');
            setIsAdding(false);
        }
    };

    return (
        <section className="flex flex-col gap-6">
            <div className="bg-white border-t-[3px] border-t-emerald-500 border-x border-b border-zinc-200/80 rounded-xl p-6 shadow-sm flex flex-col gap-6 w-full lg:w-[900px] ">
                <h2 className="text-base font-bold text-zinc-900 flex justify-between items-center">
                    Tareas pendientes 
                    <button 
                        onClick={() => setIsAdding(!isAdding)}
                        className="material-symbols-outlined hover:text-emerald-500 cursor-pointer"
                    >
                        {isAdding ? 'close' : 'add'}
                    </button>
                </h2>

                {isAdding && (
                    <div className="bg-slate-50 border border-zinc-200/60 rounded-xl p-4 flex flex-col gap-3">
                        <input 
                            type="text" 
                            placeholder="Nombre de la tarea" 
                            className="w-full border border-zinc-200 rounded p-2 text-sm"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                        />
                        <textarea 
                            placeholder="Descripción" 
                            className="w-full border border-zinc-200 rounded p-2 text-sm resize-none h-20"
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                        />
                        <button 
                            onClick={handleSave}
                            className="bg-emerald-500 text-white font-bold px-4 py-2 rounded self-end text-sm hover:bg-emerald-600 transition-colors"
                        >
                            Guardar Tarea
                        </button>
                    </div>
                )}

                {tareas.length > 0 ? (
                    <>

                        {tareas.map((tarea) => (
                            <div
                                key={tarea.id}
                                className="bg-slate-50 border border-zinc-200/60 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2 mt-2">
                                    <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
                                        {tarea.nombre}
                                    </span>

                                    <button 
                                        onClick={() => onCompletarTarea && onCompletarTarea(tarea.id)}
                                        className="material-symbols-outlined hover:text-emerald-500 cursor-pointer"
                                    >
                                        check
                                    </button>
                                </div>
                                <p className="text-md text-blue-800 font-bold" >{tarea.descripcion}</p>
                            </div>
                        ))}

                    </>
                ) : (
                    <p>No hay tareas</p>
                )}

            </div>

        </section>
    );
}