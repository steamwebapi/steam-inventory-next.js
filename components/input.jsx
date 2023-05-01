import React from 'react';

function Input({id, ...props}) {

    return <div className="form-control w-full">
        <input type="text" className="input input-bordered w-full"  {...props} id={id}/>
    </div>;
}

export default Input;
