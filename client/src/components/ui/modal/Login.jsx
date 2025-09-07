import { useNavigate } from "react-router";
import logo from "../../../assets/youtube-logo.png";
import { useForm } from "react-hook-form";
import { useLogin } from "../../../hooks/auth/useLogin";
import { useLayoutContext } from "../../../hooks/context/useLayoutContext";


const Login = () => {
  const { setOpenLogin } = useLayoutContext();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const { mutate, isPending, isError, error, isSuccess } = useLogin();



  const onSubmit = (data) => {


    const payload = {
      password: data.password,
    };



    if (data.identifier.includes("@")) {
      payload.email = data.identifier;
    } else {
      payload.userName = data.identifier;
    }

    mutate(payload, {
      onSuccess: () => {
        reset();
        setOpenLogin(false)
      },
    });
  };


  const navigateRegister = () => {
    navigate("/register");
    setOpenLogin(false);
  };

  const ActionButton = ({ onClick, children, type, disabled }) => (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="w-full cursor-pointer py-2 sm:py-2.5 px-3 sm:px-4 text-sm sm:text-base bg-var(--background)] text-[var(--foreground)] hover:bg-red-600 hover:text-white font-semibold rounded-lg shadow-md transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
    >
      {children}
    </button>
  );

  return (
    <div className="backdrop-blur-sm fixed inset-0 z-50 w-full h-full overflow-auto flex items-center justify-center font-sans">
      <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] border border-black max-w-2xl rounded-3xl bg-[var(--background)] p-3 sm:p-4 md:p-6 mx-auto">
        {/* Header Section */}
        <div className="w-full flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <img src={logo} className="w-8 sm:w-10" alt="" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter">Login</h1>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 md:space-y-5">
          {/* Username Input */}
          <div>
            <input
              type="text"
              placeholder="Username or Email"
              {...register("identifier")}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-[var(--secondary)] border border-[var(--muted)] rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Username"
              autoComplete="Username or Email"
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Password"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-[var(--secondary)] border border-[var(--muted)] rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Password"
              autoComplete="current-password"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-3 pt-3 sm:pt-4">
            <ActionButton type={"submit"} disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </ActionButton>
            <ActionButton onClick={navigateRegister}>Register</ActionButton>
            <ActionButton onClick={() => setOpenLogin(false)}>
              Cancel
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
