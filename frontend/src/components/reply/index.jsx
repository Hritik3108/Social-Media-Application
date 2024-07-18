import { useDispatch, useSelector } from "react-redux";
import { setReplyVisiblity } from "../../util/visiblitySlice";
import { useState } from "react";
import Loading from '../loading'
import axios from "axios";

const Reply = () => {
    const sessionActive = useSelector((store)=>store.user.sessionActive)
    const token = useSelector((store) => sessionActive ? store.user.token : null);

    const replyVisiblity = useSelector((store)=>store.visiblity.replyVisiblity);
    const tweetId = useSelector((store)=>store.visiblity.replyId);
    const dispatch = useDispatch();

    function handleVisiblity(){
        dispatch(setReplyVisiblity(!replyVisiblity))    
    }

    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);


    function cancelPost(){
        setContent('')
        handleVisiblity()
    }

    async function postReply(){
        if(!sessionActive)navigate('/login');
        // console.log(tweetId);
        setLoading(true);

        const formData = new FormData();
        formData.append('content', content);

        const config = {
            headers: { 
                'Authorization': `JWT ${token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };

        try {
            const replyResponse = await axios.put(`/API/tweet/${tweetId}/reply`, formData, config);
            setLoading(false);
            handleVisiblity();
            window.location.reload();
        } catch (error) {
            console.error("Error posting tweet:", error.message);
            setLoading(false);
        }
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <>  
        <div className={`d-flex align-items-center justify-content-center ${replyVisiblity ? 'd-block' : 'd-none'}`}>
            <div className="card popup-container">
                <div className="card-header">
                    <h5>Tweet your reply</h5>
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
                    placeholder="Add your reply"
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                
                <div className="button-container mt-auto text-end">
                    <button className="btn btn-secondary" onClick={cancelPost}>Cancel</button>
                    <button className="btn btn-primary" onClick={postReply}>Tweet</button>
                </div>


                </div>

            </div>
        </div>    
        </>
    )
}

export default Reply;