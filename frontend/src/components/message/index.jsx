import React from 'react';
import PropTypes from 'prop-types';
import './message.css';

const Message = ({ message, type }) => {
    return (
        <div className={`message ${type}`}>
            {message}
        </div>
    );
};

Message.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['error', 'info', 'success']).isRequired
};

export default Message;
