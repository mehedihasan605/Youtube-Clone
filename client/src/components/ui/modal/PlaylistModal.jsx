import { useForm } from "react-hook-form";
import { useUpdatePlaylist } from "../../../hooks/playlist/useUpdatePlaylist";

const PlaylistModal = ({ isOpen, isClose, playlistId }) => {
  const { register, handleSubmit, reset } = useForm();

  const { mutate, isPending, isError, error, isSuccess } = useUpdatePlaylist();
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("playlistImage", data.playlistImage[0]);
    formData.append("name", data.name);
    formData.append("description", data.description);

    mutate(
      { formData, playlistId },
      {
        onSuccess: () => {
          reset();
          isClose();
        },
      }
    );
  };

  const ActionButton = ({ onClick, children, type, disabled }) => (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="w-full cursor-pointer py-2.5 px-4 bg-[#f2f2f2] hover:bg-red-600  hover:text-white font-semibold rounded-lg shadow-md transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
    >
      {children}
    </button>
  );

  if (!isOpen) return null;

  return (
    <div>
      <div className="backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out font-sans">
        <div className="w-full border border-black max-w-2xl rounded-3xl bg-white p-6">
          {/* Header Section */}
          <div className="w-full flex items-center justify-center gap-4 mb-8">
            <h1 className="text-5xl font-bold  tracking-tighter">Update</h1>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-y-3 justify-center items-center py-6">
              <label
                htmlFor="name"
                className="text-gray-700 transition-colors duration-200"
              >
                Update Playlist Thumbnail
              </label>
              <input
                type="file"
                name="name"
                {...register("playlistImage")}
                accept="image/*"
                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
                required
              />
            </div>

            {/* Username Input */}
            <div>
              <input
                type="text"
                placeholder="Playlist Name"
                {...register("name")}
                className="w-full px-4 py-3 bg-[#f2f2f2] border border-[#f2f2f2] rounded-lg  placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Username"
                autoComplete="Username or Email"
              />
            </div>

            {/* TextArea */}
            <div>
              <textarea
                id="w3review"
                placeholder="Descriptions"
                className="bg-[#f2f2f2] rounded-md px-4 py-2 focus:border-none outline-none border border-[#f2f2f2] w-full"
                {...register("description")}
                rows="4"
                cols="50"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              <ActionButton type={"submit"} disabled={isPending}>
                {isPending ? "Updating..." : "Update"}
              </ActionButton>

              <ActionButton onClick={() => isClose()}>Cancel</ActionButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;
