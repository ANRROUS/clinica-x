export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Clínica X &mdash; Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="/" className="text-sm text-gray-500 hover:text-brand-600">
              Inicio
            </a>
            <a href="/reservar-cita" className="text-sm text-gray-500 hover:text-brand-600">
              Reservar Cita
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}