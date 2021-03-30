import React from 'react';
import PropTypes from 'prop-types';

const Element = ({ id, content, time, copyOnClick, onRemove }) => {
    return (
        <div className='element'>
            <pre>{content}</pre>
            <div>
                <label>{time.toLocaleString()}</label>
                <div className='buttons'>
                    <button className='copy-button' onClick={() => copyOnClick(id, content)}>Copy</button>
                    {onRemove ? <button className='remove-button' onClick={() => onRemove(id)}>Remove</button> : ''}
                </div>
            </div>
        </div>
    )
}

Element.propTypes = {
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    copyOnClick: PropTypes.func,
    onRemove: PropTypes.func,
}

export default Element;