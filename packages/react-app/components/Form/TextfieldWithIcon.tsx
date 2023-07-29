import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const TextfieldWithIcon = () => {
  return (
    <>
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 flex items-center pb-1 pl-3.5 pointer-events-none">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
        </div>
        <input
          type="text"
          id="search"
          className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 "
          placeholder="Search"
        />
      </div>
    </>
  );
};

export default TextfieldWithIcon;
