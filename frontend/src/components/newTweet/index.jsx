import { useDispatch, useSelector } from "react-redux";
import { setNewTweetVisiblity } from "../../util/visiblitySlice";
import { useState } from "react";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import './newTweet.css';
import Loading from '../loading'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewTweet = () => {
    const newTweetVisiblity = useSelector((store) => store.visiblity.newTweetVisiblity);
    const sessionActive = useSelector((store)=>store.user.sessionActive)
    const token = useSelector((store) => sessionActive ? store.user.token : null);
    
    const navigate=useNavigate();
    const dispatch = useDispatch();

    function handleVisiblity() {
        dispatch(setNewTweetVisiblity(!newTweetVisiblity));
        window.location.reload();
    }

    const [content, setContent] = useState('');
    const [image,setImage] = useState(null);
    const [tweetImage, setTweetImage] = useState();
    const [loading, setLoading] = useState(false);

    function handlePicture(e) {
        const file = e.target.files[0];
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setTweetImage(reader.result);
        };
        reader.readAsDataURL(file);
    }

    async function addTweet(e){
        e.preventDefault();
        if(!sessionActive)navigate('/login');
        setLoading(true);
        
        const formData = new FormData();
        {image!==undefined && formData.append('file', image)};
        formData.append('content', content);

        const config = {
            headers: { 
                'Authorization': `JWT ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        };
        try {
            const addResponse = await axios.post('/API/tweet', formData, config);
            setLoading(false);
            if(addResponse.status===201)toast.success("Tweet posted!");
        } catch (error) {
            toast("Error posting tweet!");
            console.error("Error posting tweet:", error.message);
            setLoading(false);
        }
    }

    function cancelPost(){
        setImage()
        setTweetImage()
        setContent('')
        handleVisiblity()
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <div className={`d-flex align-items-center justify-content-center ${newTweetVisiblity ? 'd-block' : 'd-none'}`}>
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition: Bounce
            ></ToastContainer>
                <div className="card popup-container">
                    <div className="card-header">
                        <h5>New Tweet</h5>
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
                        <textarea
                            className="tweet-content"
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>

                        <label htmlFor="tweet-image-input" className="label-cls">
                            <FontAwesomeIcon icon={faImage} className='heart-btn-icon p-1' />
                        </label>
                        <input
                            type="file"
                            id="tweet-image-input"
                            name="tweetImage"
                            className="tweet-image-input"
                            onChange={handlePicture}
                        />

                        {tweetImage &&
                            <img src={tweetImage} alt="tweet-image" className="tweet-image" />
                        }

                        <div className="button-container mt-auto text-end">
                            <button className="btn btn-secondary" onClick={cancelPost}>Cancel</button>
                            <button className="btn btn-primary" onClick={addTweet}>Tweet</button>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default NewTweet;
