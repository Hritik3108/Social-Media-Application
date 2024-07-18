import TweetCard from "../tweetCard";
import { useDispatch, useSelector } from "react-redux";
import { setNewTweetVisiblity } from "../../util/visiblitySlice";
import { useEffect, useState } from "react";
import { addTweets } from "../../util/tweetSlice";
import Loading from '../loading'
import axios from "axios";

const TweetList = () => {
    const newTweetVisiblity = useSelector((store)=>store.visiblity.newTweetVisiblity);
    const tweets = useSelector((store)=>store.tweet.tweets);
    const activePath = useSelector((store)=>store.user.active)
    const sessionActive = useSelector((store)=>store.user.sessionActive)
    const userId = useSelector((store) => sessionActive ? store.user.user._id : null);

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);


    function handleVisiblity(){
        dispatch(setNewTweetVisiblity(!newTweetVisiblity))    
    }

    useEffect(()=>{
        setLoading(true);
        const fetchData = async () => {
            try {
                const fetchResponse = await axios.get(`/API/tweets`);
                dispatch(addTweets(fetchResponse.data))
                // console.log(fetchResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error.message);
                setLoading(false);
            }
        };

        fetchData();
    },[activePath])

    useEffect(()=>{
        window.scroll(0,0)
    },[])

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <span className="d-flex p-2 align-items-center justify-content-between">
                <h2 className="mainScreen-heading">Home</h2>
                <button className="btn btn-primary mainScreen-heading" onClick={handleVisiblity}>Tweet</button>  
            </span>
            
            {tweets.slice().reverse().map((tweet) => (
                                     <TweetCard key={tweet._id} tweet={tweet} userId={userId} />
                                ))}

        </>
    )
}

export default TweetList;