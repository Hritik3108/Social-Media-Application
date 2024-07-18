import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import './sidebar.css'
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { logoutUser, setActive } from '../../util/userSlice';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { faHome, faLongArrowAltRight, faUser } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    const active = useSelector((store)=>store.user.active);
    const sessionActive = useSelector((store)=>store.user.sessionActive)
    const user = useSelector((store) => sessionActive ? store.user.user : null);
    
    const dispatch = useDispatch();
    const navigate=useNavigate();

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    function handleActiveTab(path){
        navigate('/')
        dispatch(setActive(path));
    }

    function handleLogout(){
        dispatch(logoutUser());
        navigate('/login')
    }

    function handleImageSource(source){
        // console.log('source',source)
        if((source.slice(0,4))==="file"){
            return `http://localhost:5100/${source}`
        }
        else return source;
    }

    return (
        <div className='container sidebar-container'>
            <div className="row">
                <div className="col col-12">
                    <button className="btn sidebar-btn" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={faMessage} className='toggle-btn-icon'/>
                    </button>
                    
                    <div className={`vh-100 p-3 sidebar-div ${showSidebar ? 'd-block' : 'd-none'} d-md-block`}>
                        <ul className='sidebar-ul flex-column mb-auto'>
                            <li className={`sidebar-li ${active=='home'?'active':''}`} onClick={()=>handleActiveTab('home')}>
                                <FontAwesomeIcon icon={faHome} className='toggle-btn-icon me-2'/>
                                Home
                            </li>
                            <li className={`sidebar-li ${active=='profile'?'active':''}`} onClick={()=>handleActiveTab('profile')}>
                                <FontAwesomeIcon icon={faUser} className='toggle-btn-icon me-2'/>
                                Profile
                            </li>
                            {
                                sessionActive?
                                <li className='sidebar-li' onClick={handleLogout}>
                                    <FontAwesomeIcon icon={faLongArrowAltRight} className='toggle-btn-icon me-2'/>
                                    Logout
                                </li>
                                :
                                <li className='sidebar-li' onClick={()=>navigate('/login')}>
                                    <FontAwesomeIcon icon={faLongArrowAltRight} className='toggle-btn-icon me-2'/>
                                    Login
                                </li>
                            }    
                        </ul>
                        
                        <ul className='sidebar-bottom-ul'>    
                            <li className='sidebar-bottom-li'>
                                <a href="#" className="d-flex align-items-center text-decoration-none" >
                                    <img src={user==null?'https://via.placeholder.com/50':handleImageSource(user.profilePicture)} alt="" width="32" height="32" className="rounded-circle me-2 sidebar-profile-pic" />
                                    <strong>@{user==null?'username':user.userName}</strong>
                                </a>
                            </li>
                        </ul>
                    </div>    
                </div>
                <div className='col'>

                </div>
            </div>
        </div>
    );
};

export default Sidebar;
