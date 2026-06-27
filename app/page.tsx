"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg("Error de autenticación: Verifica tus credenciales.");
      } else {
        router.push("/dashboard-recolectores");
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Cuenta creada. Ahora puedes iniciar sesión.");
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center font-sans bg-slate-50 p-4 md:p-8 relative">
      {/* Patrón de cuadrícula de fondo dinámico */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      {/* Tarjeta contenedora principal */}
      <div className="relative z-10 w-full max-w-[440px] bg-white border border-zinc-200/80 shadow-xl shadow-zinc-200/30 rounded-xl overflow-hidden flex flex-col">
        {/* Barra de gradiente de acento superior */}
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-500" />

        <div className="p-8 md:p-10 flex flex-col flex-1">
          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">
              {isLogin ? "Portal de Acceso" : "Registro de Sistema"}
            </h1>
            <p className="text-xs text-zinc-500 mt-1.5 font-medium tracking-normal">
              {isLogin ? "Inicie sesión para gestionar su ecosistema operativo." : "Cree sus credenciales operativas."}
            </p>
            {errorMsg && (
              <p className="text-xs text-red-500 mt-3 font-medium tracking-normal bg-red-50 p-2 rounded border border-red-200">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
            {/* Campo de Correo Electrónico Comercial */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                Correo Electrónico Comercial
              </label>
              <div className="flex items-center gap-3 border-b border-zinc-200 focus-within:border-blue-500 transition-colors py-2">
                <span className="text-sm font-semibold text-zinc-400 select-none">@</span>
                <input
                  id="email"
                  type="email"
                  placeholder="nombre@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-transparent border-0 p-0 text-sm text-zinc-800 placeholder-zinc-350 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* Campo de Clave de Seguridad */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="security-key" className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                Clave de Seguridad
              </label>
              <div className="flex items-center gap-3 border-b border-zinc-200 focus-within:border-blue-500 transition-colors py-2">
                {/* Icono SVG de candado */}
                <span className="material-symbols-outlined">lock</span>
                <input
                  id="security-key"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1 bg-transparent border-0 p-0 text-sm text-zinc-800 placeholder-zinc-350 focus:outline-none focus:ring-0 tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    /* SVG de ojo cerrado */
                    <span className="material-symbols-outlined">visibility_off</span>
                  ) : (
                    /* SVG de ojo abierto */
                    <span className="material-symbols-outlined">visibility</span>

                  )}
                </button>
              </div>
            </div>



            {/* Botón de envío */}
            <button
              type="submit"
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-widest uppercase py-3.5 px-4 rounded transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <span>{isLogin ? "Autenticar Sistema" : "Crear Credenciales"}</span>
              <span className="material-symbols-outlined">{isLogin ? "login" : "person_add"}</span>
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-zinc-200/60" />
            </div>

          </div>

          {/* Acción secundaria (Solicitar acceso empresarial) */}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg("");
            }}
            className="w-full border border-zinc-300 hover:border-zinc-400 text-zinc-700 hover:text-zinc-950 font-bold text-xs tracking-widest uppercase py-3 px-4 rounded transition-colors duration-200 hover:bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 cursor-pointer text-center"
          >
            {isLogin ? "Solicitar Acceso Empresarial" : "Volver a Autenticar"}
          </button>
        </div>

        {/* Información/enlaces del pie de página */}
        <div className="px-8 pb-8 pt-2 flex justify-center gap-4 text-[9px] font-bold tracking-widest text-zinc-400 uppercase select-none border-t border-zinc-100/50">
          <a href="#" className="hover:text-zinc-600 transition-colors">
            Protocolo de Privacidad
          </a>
          <span className="text-zinc-300">|</span>
          <a href="#" className="hover:text-zinc-600 transition-colors">
            Operaciones Seguras
          </a>
        </div>
      </div>
    </div>
  );


}
