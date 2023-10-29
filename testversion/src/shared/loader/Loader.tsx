
import './Loader.css';

import React from 'react';

interface ILoader {
    id?: string
} 

const Loader = ({
    id
    }: ILoader): React.JSX.Element => {
    return (
        <div id={id} className={`loader`}>
        </div>
    )
}

export default Loader
