import React from 'react';

const person = (props) => {
    return (
        <div>
        <p onClick={props.click}>I'm {props.name} and I'm {props.age} !</p>
        <input type="text" onChange={props.changed}></input>
        </div>
        )
};

export default person;