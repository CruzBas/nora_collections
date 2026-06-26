import { Form_acuerdo } from "@/app/components/form_acuerdo";
import BarraSuperior from "@/app/components/barra-superior";
export default function Acuerdos() {
    return (
        <>
            <BarraSuperior pantalla="Acuerdos" />
            <div className="flex flex-row flex-1 gap-2 mt-2 mb-2">

                < div className="flex flex-col flex-1 min-h-screen bg-slate-50/50 text-zinc-800 pb-12 select-none">


                </div>


                <Form_acuerdo />
            </div>

        </>
    )
}