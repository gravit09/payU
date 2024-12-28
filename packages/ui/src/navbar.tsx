export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
      <div className="px-4">
        <div className="flex items-center justify-between">
          <div className="flex shrink-0">
            <h3 className="text-2xl text-bold">PayU</h3>
          </div>
          <div className="flex items-center justify-end gap-3">
            <a
              className="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
              href="/login"
            >
              Sign in
            </a>
            <a
              className="inline-flex items-center justify-center rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              href="/login"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
