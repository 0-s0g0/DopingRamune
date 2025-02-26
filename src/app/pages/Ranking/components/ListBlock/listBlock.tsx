import Rank from "../rank/rank";
import Context from "../context/context";
import { FC } from "react";

interface ListBlockProps{
    rank_num: number;
    point_count: number;
    file_name: string;
    name: string;
    text: string;
}

const ListBlock: FC<ListBlockProps> = ({
    rank_num,
    point_count,
    file_name,
    name,
    text
}) => {
    return(
        <>
        <Rank 
            rank_num={rank_num}
            point_count={point_count}
            />
        <Context
            file_name={file_name}
            name={name}
            text={text}/>
        </>
    )
}

export default ListBlock