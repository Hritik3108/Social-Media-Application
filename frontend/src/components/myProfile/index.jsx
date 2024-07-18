import { useEffect } from "react";
import Profile from "../profile";
import { useSelector } from "react-redux";

const MyProfile = () => {

    const sessionActive = useSelector((store)=>store.user.sessionActive)
    const user = useSelector((store) => sessionActive ? store.user.user : null);

    useEffect(()=>{
        window.scroll(0,0)
    },[])

    return (
        <>
            <span className="d-flex p-2 align-items-center justify-content-between">
                <h2 className="mainScreen-heading">Profile</h2>  
            </span>
            <Profile {...user}/>
        </>
    )
}

export default MyProfile;