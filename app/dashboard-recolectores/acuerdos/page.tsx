import { Form_acuerdo } from "@/app/components/form_acuerdo";
import BarraSuperior from "@/app/components/barra-superior";
import Card from "@/app/components/card";
export default function Acuerdos() {
    return (
        <>
            <BarraSuperior pantalla="Acuerdos" />
            <div className="flex flex-row flex-1 gap-2 mt-2 mb-2">

                < div className="flex flex-col flex-1 min-h-screen bg-slate-50/50 text-zinc-800 pb-12 select-none ml-2 p-8 flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-zinc-900">Acuerdos de Pago</h1>
                    <h3 className="text-md  text-zinc-900">Conoce los acuerdos de pago establecidos con el cliente</h3>
                    <div className="flex flex-row flex-1 gap-5 ml-5">
                        <Card
                            title="Metas de acuerdos"
                            value="342,850"
                            icon="local_atm"
                            iconFooter="arrow_upward"
                            footer="342,850 respecto al mes pasado"
                            color="border-t-blue-600"
                        />

                        <Card
                            title="Acuerdos firmados"
                            value="2 "
                            icon="description"
                            iconFooter="arrow_upward"
                            footer="2 respecto al mes pasado"
                            color="border-t-green-600"
                        />

                        <Card
                            title="Tasa de cumplimiento"
                            value="98.5%"
                            icon="timeline"
                            iconFooter="arrow_upward"
                            footer="98.5% respecto al mes pasado"
                            color="border-t-yellow-600"
                        />
                    </div>
                </div>


                <Form_acuerdo />
            </div>

        </>
    )
}