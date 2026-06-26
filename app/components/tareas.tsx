import React from 'react';
import { Tarea } from './types';

interface TareasProps {
    tareas: Tarea[];
}

export default function Tareas({ tareas }: TareasProps) {
    return (
        <section className="flex flex-col gap-6">
            <div className="bg-white border-t-[3px] border-t-emerald-500 border-x border-b border-zinc-200/80 rounded-xl p-6 shadow-sm flex flex-col gap-6 w-[900px] ">
                <h2 className="text-base font-bold text-zinc-900">Tareas pendientes <button className="material-symbols-outlined pl-[800px] hover:text-emerald-500 cursor-pointer">add</button></h2>

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

                                    <button className="material-symbols-outlined hover:text-emerald-500 cursor-pointer">
                                        Check
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