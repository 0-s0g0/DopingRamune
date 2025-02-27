import Link from "next/link";
import Post from "@/app/pages/Timeline/components/post/post";

const TimeLine = () => (
  <div className="mt-8 w-full flex flex-col gap-8 justify-center items-center">
    <Post 
    user_id = "user_id.test"
    post_id = {123456}
    text="test"
    like_count={8888}
    comment_count = {8888}
    />
    <Post 
    user_id = "user_id.test"
    post_id = {123456}
    text="test"
    like_count={8888}
    comment_count = {8888}
    />
    <Post 
    user_id = "user_id.test"
    post_id = {123456}
    text="test"
    like_count={8888}
    comment_count = {8888}
    />
    <Post 
    user_id = "user_id.test"
    post_id = {123456}
    text="test"
    like_count={8888}
    comment_count = {8888}
    />
  </div>
);

export default TimeLine;
