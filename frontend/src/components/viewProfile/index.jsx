import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Loading from '../loading'
import Profile from '../profile';

const ViewProfile = () => {

    const location = useLocation();
    const [loading, setLoading] = useState(false);    
    const [user,setUser] = useState();

    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');

    useEffect(()=>{
        window.scrollTo(0, 0);
        setLoading(true);

        async function fetchData(){
            try{
                const userResponse = await axios.get(`/API/user/${userId}`);
                if(userResponse.status===200){
                    setUser({...userResponse.data});
                }
                setLoading(false);
            }catch (error){
                setLoading(false)
                console.log(error);
            }
           
        }

        fetchData();
    },[userId])

    if(loading){
        return <Loading/>
    }

    return (
        <div className='tab-2-div'>
            <span className="d-flex p-2 align-items-center justify-content-between">
                <h2 className="mainScreen-heading">Profile</h2>  
            </span>
            {user && <Profile {...user} />}
        </div>
    )
}

export default ViewProfile;