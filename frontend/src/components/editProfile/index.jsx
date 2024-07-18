import { useDispatch, useSelector } from "react-redux";
import { setEditVisiblity } from "../../util/visiblitySlice";
import { useState } from "react";
import Loading from "../loading";
import axios from "axios";
import { updateUser } from "../../util/userSlice";

const EditProfile = () => {
    const editVisiblity = useSelector((store)=>store.visiblity.editVisiblity);
    const sessionActive = useSelector((store)=>store.user.sessionActive);
    const user = useSelector((store)=>sessionActive?store.user.user:null);
    const token = useSelector((store) => sessionActive ? store.user.token : null);

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [name,setName] = useState();
    const [dob,setDob] = useState();
    const [location,setLocation] = useState();

    useState(()=>{
        if(user!=null){
            setName(user.name)
            user.location!=undefined?setLocation(user.location):setLocation("");
            user.dob!=undefined?setDob(user.dob):setDob('');
        }else{
            setName("")
            setLocation("")
            setDob('')
        }
    },[])

    function handleVisiblity(){
        dispatch(setEditVisiblity(!editVisiblity))    
    }

    async function update(){
        setLoading(true);

        const config = {
            headers: { 
                'Authorization': `JWT ${token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };

        const bodyParameters = {
            name:name,
            location:location,
            dob:dob
        }
        console.log('body',bodyParameters)
        try {
            const updateResponse = await axios.put(`/API/user/edit`, bodyParameters, config);
            if(updateResponse.status===200){
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

    if (loading) {
        return <Loading />;
    }

    return (
        <>  
        <div className={`d-flex align-items-center justify-content-center ${editVisiblity? 'd-block' : 'd-none'}`}>
            <div className="card popup-container">
                <div className="card-header">
                    <h5>Edit Profile</h5>
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
                {/* <button onClick={()=>console.log(profileData)}>CLick</button> */}
                <label htmlFor="name" className="edit-label">
                    Name
                </label>
                <input
                    name="name"
                    id="name"
                    className="form-control"
                    onChange={(e)=>setName(e.target.value)}
                    value={name}
                    required
                />
                
                <label htmlFor="location" className="edit-label">
                    Location
                </label>
                <input
                    name="location"
                    id="location"
                    className="form-control"
                    onChange={(e)=>setLocation(e.target.value)}
                    value={location}
                    required
                />

                <label htmlFor="dob" className="edit-label">
                    Date of birth
                </label>
                <input
                    type="date"
                    name="Date"
                    id="dob"
                    className="form-control"
                    onChange={(e)=>setDob(e.target.value)}
                    value={dob}
                    required
                />

                <div className="button-container mt-4 text-end">
                    <button className="btn btn-secondary" onClick={cancelUpdate}>Cancel</button>
                    <button className="btn btn-primary" onClick={update}>Update</button>
                </div>

                </div>
            </div>
        </div>  
        </>
    )
}

export default EditProfile;