import React, { useEffect, useState } from 'react';
import './profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCake} from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faMapPin } from '@fortawesome/free-solid-svg-icons/faMapPin';
import TweetCard from '../tweetCard';
import Loading from '../loading'
import formatDateString from '../../util/formatDateString';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setEditVisiblity, setUploadProfilePictureVisiblity } from '../../util/visiblitySlice';

const Profile = (props) => {

    const uploadProfilePictureVisiblity = useSelector((store)=>store.visiblity.uploadProfilePictureVisiblity)
    const editVisiblity = useSelector((store)=>store.visiblity.editVisiblity)
    const activePath = useSelector((store)=>store.user.active)
    const sessionActive = useSelector((store)=>store.user.sessionActive)
    const token = useSelector((store)=>store.user.token)
    const userId = useSelector((store) => sessionActive ? store.user.user._id : null);
    const {_id,followers,following,name,profilePicture,userName,dob,location,createdAt} =props;

    const [loading, setLoading] = useState(false);
    const [followBtn,setFollowBtn] = useState(false);
    const [followCount,setFollowCount] = useState(0);
    const [followingCount,setFollowingCount] = useState(0);

    const dispatch = useDispatch()

    function handleImageSource(source){
        if((source.slice(0,4))==="file"){
            return `http://localhost:5100/${source}`
        }
        else return source;
    }

    function setFollowAndFollowing(){
        {followers && setFollowCount(followers.length)}
        {following && setFollowingCount(following.length)}
    }

    const [profileTweets,setProfileTweets] = useState([]);

    useEffect(()=>{
        setLoading(true);
        const fetchData = async () => {
            try {
                const fetchResponse = await axios.get(`/API/tweets/user/${_id}`);
                setProfileTweets([...fetchResponse.data])
                // console.log(fetchResponse.data);
                setLoading(false);
            } catch (error) {
                // console.error("Error fetching data:", error.message);
                setLoading(false);
            }
        };

        fetchData();
    },[activePath])

    const config = {
        headers: { 
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json' 
        },
        withCredentials: true
    };

    function followBtnStatus(){
        if(userId!=null){
            setFollowBtn(followers.includes(userId)); //already following
        }else{
            setFollowBtn(false);
        }
    }

    async function follow(){
        // console.log('follow')
        try {
            const followResponse = await axios.put(`/API/user/${_id}/follow`,{},config);
            if(followResponse.status===200){
                setFollowBtn(true);
                setFollowCount(followCount+1);
            }
            // window.location.reload();
            // console.log(followResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    }

    async function unfollow(){ 
        // console.log('unfollow')
        try {
            const unFollowResponse = await axios.put(`/API/user/${_id}/unFollow`,{},config);
            if(unFollowResponse.status===200){
                setFollowBtn(false);
                setFollowCount(followCount-1);
                // window.location.reload();
            }
            // console.log(unFollowResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    }

    async function handleFollow(){
        const newState = !followBtn;
        setFollowBtn(newState);
        if (newState) {
            follow();
        } else {
            unfollow();
        }
    }

    useEffect(()=> {
        followBtnStatus();
        setFollowAndFollowing();
    },[])

    function handleEdit(){
        // console.log('edit')
        dispatch(setEditVisiblity(!editVisiblity))
    }

    function handleUploadProfilePicture(){
        console.log('upload')
        dispatch(setUploadProfilePictureVisiblity(!uploadProfilePictureVisiblity));
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container profile-container">
            
            {/* Profile cover row */}
            <div className="row profile-cover-row position-relative">
                <div className="profile-cover"></div>
                <img 
                    src={`${profilePicture?handleImageSource(profilePicture):'https://via.placeholder.com/100'}`} 
                    alt="Profile" 
                    className="profile-picture rounded-circle" 
                />
            </div>

            {/* Profile Info Row */}
            <div className="row mt-5">
                <div className="col col-sm-9 mt-5">
                    <div className="profile-username"><strong>{name}</strong></div>
                    <div className="profile-username">@{userName}</div>
                
                    <div className='tweet-buttons d-flex align-items-center justify-content-between w-100'>
                        <p className='me-4' onClick={()=>handleEdit()}>
                            <FontAwesomeIcon icon={faCake} className='heart-btn-icon p-1' />
                            <span>
                                 {dob?formatDateString(dob):'Edit to add'}
                            </span>
                        </p>
                        <p className='me-4'  onClick={()=>handleEdit()}>
                            <FontAwesomeIcon icon={faMapPin} className='comment-btn-icon'/>
                            <span>
                                Location, {location?location:'Edit to add'}
                            </span>
                        </p>
                    </div>  
                    <div className='tweet-buttons ms-1'>
                        <p className='me-4'>
                            <FontAwesomeIcon icon={faCalendar} className='retweet-btn-icon'/>
                            <span>
                                Joined on {formatDateString(createdAt)}
                            </span>
                        </p>
                    </div>
                    <br/>
                    <div className='d-flex align-items-center'>
                        <p className='me-5'>
                            {following?followingCount:'0'} Following
                        </p>
                        <p className='me-1'>
                            {followers?followCount:'0'} Followers
                        </p>
                    </div>
                </div>

                {
                    userId!==_id?
                <div className="col col-3 text-end">
                    <button className='follow-btn btn btn-dark' onClick={()=>handleFollow()}>{followBtn?'Unfollow':'Follow'}</button>
                </div>
                    :
                <div className="text-end myProfile-btn">
                    <button className='profile-pic-btn me-2 btn btn-primary bg-light text-wrap' onClick={()=>handleUploadProfilePicture()}>Upload Profile Photo</button>
                    <button className='profile-edit-btn btn btn-dark bg-light text-wrap' onClick={()=>handleEdit()}>Edit</button>
                </div>    
                }  
            </div>

            {/* Tweets and Replies row */}
            <div className="row d-flex align-items-center justify-content-center">
                <h6 className='text-center'>Tweets and Replies</h6>
                {profileTweets && profileTweets.slice().reverse().map((tweet) => (
                                     <TweetCard key={tweet._id} tweet={tweet} userId={userId} />
                                ))}
            </div>
            
        </div>
    );
};

export default Profile;
