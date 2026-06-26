interface CardProps {
    title: string;
    value: number | string;
    icon: string;
    iconFooter: string;
    footer: string;
    color: string;


}

export default function Card({ title, value, icon, iconFooter, footer, color }: CardProps) {
    return (
        <div className={`bg-white border-t-[3px] border-t-blue-600 rounded-xl p-6 flex flex-col justify-between h-44 relative w-[300px]`}>
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                        {title}
                    </span>
                    <span className={`text-3xl font-extrabold text-black mt-2`}>{value}</span>
                </div>
                {/* Ícono de tendencia al alza */}
                <span className={`material-symbols-outlined text-black`}>
                    {icon}
                </span>
            </div>
            {/* Indicador porcentual comparativo */}
            <div>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold py-1 px-2 rounded">
                    <span className="material-symbols-outlined">
                        {iconFooter}
                    </span>
                    {footer}
                </span>
            </div>
        </div>


    );
}