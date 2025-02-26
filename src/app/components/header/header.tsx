import Link from "next/link";

const Header = () => (
  <div className="fixed top-0 w-[374px] h-16 p-4 z-50 bg-pink-vivid shadow-md text-white font-bold flex justify-between items-center">
    <Link href={"/pages/Timeline"} className="ml-3">
      DreamShare
    </Link>
  </div>
);

export default Header;
