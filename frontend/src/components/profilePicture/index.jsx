import { useDispatch, useSelector } from "react-redux";
import { setUploadProfilePictureVisiblity } from "../../util/visiblitySlice";
import { useState } from "react";
import Loading from "../loading";
import axios from "axios";
import { updateUser } from "../../util/userSlice";
import { useNavigate } from "react-router-dom";
import Message from "../message";

const ProfilePicture = () => {
    const uploadProfilePictureVisiblity = useSelector((store)=>store.visiblity.uploadProfilePictureVisiblity);
    const sessionActive = useSelector((store)=>store.user.sessionActive);
    const user = useSelector((store)=>sessionActive?store.user.user:null);
    const token = useSelector((store) => sessionActive ? store.user.token : null);

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [picture,setPicture] = useState();
    const [picturePreview,setPicturePreview] = useState();

    useState(()=>{
        if(user!=null){
            user.profilePicture!=undefined?setPicturePreview(user.profilePicture):setPicturePreview("");
        }else{
            setPicturePreview('')
        }
    },[])

    function handleVisiblity(){
        dispatch(setUploadProfilePictureVisiblity(!uploadProfilePictureVisiblity))    
    }

    async function update(){
        setLoading(true);

        const config = {
            headers: { 
                'Authorization': `JWT ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        };

        const formData = new FormData();
        {picture!==undefined && formData.append('file', picture)};

        
        try {
            const updateResponse = await axios.post(`/API/user/uploadProfilePic`, formData, config);
            if(updateResponse.status===201){
                // console.log('profilepic',updateResponse.data)
                dispatch(updateUser(updateResponse.data))   
            }
            setLoading(false);
            handleVisiblity();
        } catch (error) {
            console.error("Error posting tweet:", error.message);
            setLoading(false);
        }
    }

    function cancelUpdate(){
        handleVisiblity();
    }

    function handlePicture(e){
        const file = e.target.files[0];
        setPicture(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPicturePreview(reader.result);
        };
        reader.readAsDataURL(file);
    }

    function handleImageSource(source){
        if((source.slice(0,4))==="file"){
            return `http://localhost:5100/${source}`
        }
        else return source;
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <>  
        <div className={`d-flex align-items-center justify-content-center ${uploadProfilePictureVisiblity? 'd-block' : 'd-none'}`}>
            <div className="card popup-container">
                <div className="card-header">
                    <h5>Upload Profile Pic</h5>
                    <button
                        type="button"
                        className="close-btn align-items-center justify-content-center"
                        onClick={handleVisiblity}
                    >
                        <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                    </button>
                </div>

                <div className="card-body d-flex flex-column">
                
                <Message message="Note: The image should be square in shape" type="info"/>

                <input
                    type="file"
                    id="picture"
                    name="picture"
                    className="picture-form form-control"
                    onChange={handlePicture}
                />

                {picturePreview && (
                    <img
                        src={handleImageSource(picturePreview)}
                        className='picture-preview mt-2'
                        alt="Profile Preview"
                    />
                    )}            

                <div className="button-container mt-4 text-end">
                    <button className="btn btn-secondary" onClick={cancelUpdate}>Close</button>
                    <button className="btn btn-primary" onClick={update}>Save Profile Pic</button>
                </div>

                </div>
            </div>
        </div>  
        </>
    )
}

export default ProfilePicture;