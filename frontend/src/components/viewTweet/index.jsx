import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Loading from '../loading'
import Profile from '../profile';
import TweetCard from '../tweetCard';
import { useSelector } from 'react-redux';

const ViewTweet = () => {

    const sessionActive = useSelector((store)=>store.user.sessionActive)
    const userId = useSelector((store) => sessionActive ? store.user.user._id : null);

    const location = useLocation();
    const [loading, setLoading] = useState(false);    
    const [tweet,setTweet] = useState();

    const params = new URLSearchParams(location.search);
    const tweetId = params.get('tweet');

    useEffect(()=>{
        window.scrollTo(0, 0);
        setLoading(true);

        async function fetchData(){
            try{
                const tweetResponse = await axios.get(`/API/tweet/${tweetId}`);
                if(tweetResponse.status===200){
                    setTweet({...tweetResponse.data});
                }
                setLoading(false);
            }catch (error){
                setLoading(false)
                console.log(error);
            }
           
        }

        fetchData();
    },[tweetId])

    if(loading){
        return <Loading/>
    }

    return (
        <div className='tab-2-div'>
            <span className="d-flex p-2 align-items-center justify-content-between">
                <h2 className="mainScreen-heading">Home</h2>  
            </span>
            {tweet && <TweetCard tweet={tweet} userId={userId}/>}

            {tweet && tweet.replies && tweet.replies.slice().reverse().map((tweet) => (
                                     <TweetCard key={tweet._id} tweet={tweet} userId={userId} />
                                ))}
        </div>
    )
}

export default ViewTweet;