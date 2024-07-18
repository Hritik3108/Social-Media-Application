import { useSelector } from 'react-redux';
import '../home.css'
import TweetList from '../tweetList'
import MyProfile from '../myProfile'
import NewTweet from '../newTweet';
import Reply from '../reply';
import EditProfile from '../editProfile';
import ProfilePicture from '../profilePicture'

const Home = () => {
    const activePath = useSelector((store)=>store.user.active)

    return (
        <div>
            <NewTweet/>
            <Reply/>
            <EditProfile/>
            <ProfilePicture/>
        {
        activePath === 'home' && 
            <div className='tab-1-div'>
                <TweetList />
            </div>
        }
        {
        activePath === 'profile' && 
            <div className='tab-2-div'>
                <MyProfile/>
            </div>
        }
        </div>
    )
}

export default Home;