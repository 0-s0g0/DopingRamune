import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse,faMagnifyingGlass,faUser,faRankingStar,faPlus} from "@fortawesome/free-solid-svg-icons";

const Footer = () => (
  <div className="fixed bottom-0 w-[374px] h-16 p-4 z-50 bg-pink-vivid shadow-md text-white font-bold flex justify-between items-center">
    
    <Link href={"/pages/Timeline"}>
        <FontAwesomeIcon icon={faHouse} className="w-10 h-10" />
    </Link>

    <Link href={"/pages/Serch"}>        
        <FontAwesomeIcon icon={faMagnifyingGlass} className="w-10 h-10"/>
    </Link>
    
    <Link href={"/pages/Edit"} >
        <FontAwesomeIcon icon={faPlus} className="w-10 h-10" />
    </Link>

    <Link href={"/pages/Ranking"} >
        <FontAwesomeIcon icon={faRankingStar} className="w-10 h-10"/>
    </Link>
    <Link href={"/pages/Mypage?user_id=qwertyuiop"} >
        <FontAwesomeIcon icon={faUser} className="w-10 h-10"/>
    </Link>
  </div>
);

export default Footer;
