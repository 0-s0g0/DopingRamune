import Link from "next/link";
import Userdata from "./components/userdata";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse,faMagnifyingGlass,faUser,faRankingStar,faPlus} from "@fortawesome/free-solid-svg-icons";



const TimeLine = () => (
  <div className="mt-8 w-full flex flex-col gap-8 justify-center items-center">
    <Userdata 
    user_id = "user_id.test"
    total_mypoint={200}
    total_cherrpoint={100}
    />
  </div>
);

export default TimeLine;
