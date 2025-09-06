import { useForm } from "react-hook-form";
import { useLayoutContext } from "../hooks/context/useLayoutContext";

const Register = () => {
  const { setOpenLogin } = useLayoutContext()

  const { register, handleSubmit, reset } = useForm();
  const { mutate, isPending } = useRegister();

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("userName", data.userName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar[0]);
    formData.append("coverImage", data.coverImage[0]);

    mutate(formData, {
      onSuccess: () => reset(),
    });
  };
  return (
    <div className="flex w-full">
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="min-h-screen flex items-center bg-white text-gray-800 p-2 sm:p-4">
       
             <div className="w-full max-w-2xl bg-white border border-gray-200 p-4 sm:p-6 md:p-8 rounded-xl shadow-md mx-auto">
               <div className="flex items-center gap-2 sm:gap-4 justify-center mb-6 sm:mb-8 md:mb-10">
                 <img className="w-8 sm:w-10 rounded-full" src={logo} alt="" />
                 <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-red-600">
                   Create Account
                 </h2>
               </div>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                 <input
                   type="text"
                   name="fullName"
                   {...register("fullName", { required: true })}
                   placeholder="Full Name"
                   className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                 />
                 <input
                   type="text"
                   name="userName"
                   {...register("userName", { required: true })}
                   placeholder="Username"
                   className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                 />
                 <input
                   type="email"
                   name="email"
                   {...register("email", { required: true })}
                   placeholder="Email Address"
                   className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                 />
                 <input
                   type="password"
                   name="password"
                   {...register("password", { required: true })}
                   placeholder="Password"
                   className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                 />
       
                 <div className="flex flex-col gap-0.5 sm:gap-1">
                   <label className="text-xs sm:text-sm font-medium text-gray-700">Avatar</label>
                   <input
                     type="file"
                     name="avatar"
                     {...register("avatar", { required: true })}
                     accept="image/*"
                     className="text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
                     required
                   />
                 </div>
       
                 <div className="flex flex-col gap-0.5 sm:gap-1">
                   <label className="text-xs sm:text-sm font-medium text-gray-700">
                     Cover Image
                   </label>
                   <input
                     type="file"
                     name="coverImage"
                     {...register("coverImage")}
                     accept="image/*"
                     className="text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
       
                   />
                 </div>
       
                 <button
                   type="submit"
                   className="w-full bg-red-600 hover:bg-[#F2F2F2] transition-colors py-2 sm:py-3 rounded font-semibold text-sm sm:text-base text-white hover:text-red-500 cursor-pointer"
                 >
                   {isPending ? "Registering..." : "Register"}
                 </button>
               </form>
               <div className="mt-4 sm:mt-6 flex justify-center">
                 <p className="font-medium text-xs sm:text-sm md:text-base">If You Already Registred Plese <button className="underline text-red-500 cursor-pointer" onClick={() => setOpenLogin(true)}>Login</button></p>
               </div>
             </div>
           </div>
      </div>
    </div>
  );
};

export default Register;
