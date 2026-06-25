import NavLinks from "@/app/components/nav-links";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-row overflow-hidden bg-slate-50">
      {/* Panel lateral izquierdo de navegación fija */}
      <div className="w-[260px] flex-none h-full hidden md:block">
        <NavLinks />
      </div>

      {/* Contenido principal con scroll independiente */}
      <div className="flex-grow h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
