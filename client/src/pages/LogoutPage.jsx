import { useLayoutContext } from "../hooks/context/useLayoutContext";

const LogoutPage = ({ title, message }) => {
  const { setOpenLogin } = useLayoutContext()
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-70px)] bg-[var(--background)] text-[var(--foreground)]">
      <div className="text-center">


        {/* Main Heading */}
        <h1 className="text-2xl font-normal mb-4 text-balance">{title}</h1>

        {/* Subtitle with Learn more link */}
        <p className="text-base mb-8 leading-relaxed">
          {message}
        </p>

        {/* Sign in Button */}
        <button onClick={() => setOpenLogin(true)} className="bg-transparent border border-[var(--secondary)] text-[#3ea6ff] hover:bg-[var(--foreground)] cursor-pointer hover:border-[#3ea6ff] px-6 py-2 rounded-full font-medium transition-colors flex items-center justify-center mx-auto">
          {/* Custom user icon using SVG */}

          Sign in
        </button>
      </div>
    </div>
  );
};

export default LogoutPage;