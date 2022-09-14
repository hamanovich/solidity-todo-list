import { BiSearch } from "react-icons/bi";

const Navbar = () => (
  <div className="w-[full] flex px-2 py-8 justify-between">
    <div className="flex-1 flex place-content-end gap-[30px]">
      <BiSearch className="text-[#93aff9] text-3xl cursor-pointer" />
    </div>
  </div>
);

export default Navbar;
