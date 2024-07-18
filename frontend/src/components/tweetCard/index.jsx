import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './tweetCard.css';
import { faComment,faHeart as regularHeart} from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart, faRetweet, faTrash} from '@fortawesome/free-solid-svg-icons';
import formatDateString from '../../util/formatDateString';
import { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import axios from 'axios';
import { setReplyTweetId, setReplyVisiblity } from '../../util/visiblitySlice';
import { useNavigate } from 'react-router-dom';

const TweetCard = (props) => {

    const {_id,content,createdAt,image,likes,replies,retweetBy,tweetedBy} = props.tweet;
    const {profilePicture,userName} = tweetedBy;
    const {userId} = props
    const token = useSelector((store) => store.user.token);
    const replyVisiblity = useSelector((store) => store.visiblity.replyVisiblity);

    let [totalLikes,setTotalLikes]=useState(likes.length);
    let [totalComments,setTotalComments]=useState(replies.length);
    let [totalRetweet,setTotalRetweet]=useState(retweetBy.length);
    const [likeBtn,setLikeBtn] = useState(false);

    const navigate = useNavigate();
    const dispatch=useDispatch();

    const config = {
        headers: { 
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json' 
        },
        withCredentials: true
    };


    function likeBtnStatus(){
        if(userId!=null){
            setLikeBtn(likes.includes(userId));
        }else{
            setLikeBtn(false);
        }
    }

    function handleImageSource(source){
        if((source.slice(0,4))==="file"){
            return `http://localhost:5100/${source}`
        }
        else return source;
    }

    async function likePost(){
        try {
            const likeResponse = await axios.put(`/API/tweet/${_id}/like`,{},config);
            if(likeResponse.status===200){
                setLikeBtn(true);
                setTotalLikes(totalLikes+1);
            }
            console.log(likeResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    }

    async function disLikePost(){
        try {
            const dislikeResponse = await axios.put(`/API/tweet/${_id}/dislike`,{},config);
            if(dislikeResponse.status===200){
                setLikeBtn(false);
                setTotalLikes(totalLikes-1);
            }
            console.log(dislikeResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    }

    async function handleLike(){
        const newState = !likeBtn;
        setLikeBtn(newState);
        if (newState) {
            likePost();
        } else {
            disLikePost();
        }
    }

    async function handleRetweet(){
        try {
            const retweetResponse = await axios.put(`/API/tweet/${_id}/retweet`,{},config);
            if(retweetResponse.status===200){
                setTotalRetweet(totalRetweet+1);
            }
            console.log(retweetResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    }

    function handleCommentVisibility(){
        // console.log('click',replyVisiblity)
        dispatch(setReplyTweetId(_id));
        dispatch(setReplyVisiblity(!replyVisiblity))
    }

    async function handleDelete(){
        // console.log('delete');
        try {
            const deleteResponse = await axios.delete(`/API/tweet/${_id}/delete`,config);
            if(deleteResponse.status===200){
                window.location.reload();
            }
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    }

    function handleOnProfileClick() {
        navigate(`/viewProfile?userId=${tweetedBy._id}`);
    }

    function handleOnTweetContentClick() {
        navigate(`/viewTweet?tweet=${_id}`);
    }

    useEffect(()=>{
        likeBtnStatus();
    },[])

    return (
        <div className='container-fluid tweetCard-container'>
            <div className="row ms-3 retweeted-by">
                {retweetBy.length!==0?
                    <p>
                    <FontAwesomeIcon icon={faRetweet}/> Retweeted by {retweetBy[0].userName}
                    </p>
                    :
                    ''
                }
            </div>
            <div className="row mt-2">
                
                <div className="col-auto">
                    {/* profile pic col*/}
                    <img 
                        src={` ${profilePicture?handleImageSource(profilePicture):'https://via.placeholder.com/50'}`} 
                        alt="Profile" 
                        width="50" 
                        height="50" 
                        className="rounded-circle sidebar-profile-pic" 
                        onClick={()=>handleOnProfileClick()}
                    />
                </div>
                <div className="col">
                    <p className='mb-2 d-block'>
                        <span className='username' onClick={()=>handleOnProfileClick()}>
                            <strong>@{userName}</strong>
                        </span>
                         
                        <span className='dateOfCreation'>
                            ({formatDateString(createdAt)}) 
                            
                            {(userId && tweetedBy) && userId===tweetedBy._id && <FontAwesomeIcon icon={faTrash} className='ml-auto ms-2 delete-btn' onClick={()=>handleDelete()}/>}
                        </span>
                    </p>

                    <p className='tweet-content' onClick={handleOnTweetContentClick}>
                        {content}
                    </p>
                    {image && <img 
                        src={handleImageSource(image)}
                        alt='Tweet'
                        className='tweet-image'
                        onClick={handleOnTweetContentClick}
                    />}

                    <div className='tweet-buttons d-flex align-items-center justify-content-between w-50'>
                        <p className='me-4'><FontAwesomeIcon icon={likeBtn ? solidHeart : regularHeart} className={`heart-btn-icon p-1 `} onClick={()=>handleLike()}/>
                            <span>{totalLikes}</span>
                        </p>
                        <p className='me-4'><FontAwesomeIcon icon={faComment} className='comment-btn-icon' onClick={()=>handleCommentVisibility()}/>
                            <span>{totalComments}</span>
                        </p>
                        <p className='me-4'><FontAwesomeIcon icon={faRetweet} className='retweet-btn-icon' onClick={()=>handleRetweet()}/>
                            <span>{totalRetweet}</span>
                        </p>
                    </div>        
                </div>
            </div>
        </div>
    );
}

export default TweetCard;
