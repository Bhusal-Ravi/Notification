import { useNavigate } from "react-router-dom";

function ErrorFallback() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdf6ec] p-6">
      <div className="relative w-full max-w-lg rounded-3xl border-4 border-black bg-white p-10 shadow-[10px_10px_0_#000]">

        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rotate-12 border-4 border-black bg-[#ff6b6b]" />
        <div className="pointer-events-none absolute -bottom-6 -left-6 h-16 w-16 -rotate-6 border-4 border-black bg-[#ffe600]" />

        {/* Content */}
        <div className="relative text-center">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight">
            Something went wrong
          </h1>

          <p className="mb-8 text-base text-gray-600">
            An unexpected error occurred. You can return to the homepage or refresh the app.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/")}
              className="w-full rounded-xl border-4 border-black bg-[#7df9ff] py-3 text-lg font-bold uppercase tracking-wide transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
              Go to Home
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-xl border-4 border-black bg-white py-3 text-sm font-semibold uppercase tracking-wide transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;
