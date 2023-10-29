
import './SubComp1.css';

import React from 'react';

interface ISubComp1 {
    id?: string
} 

const SubComp1 = ({
    id
    }: ISubComp1): React.JSX.Element => {
    return (
        <div  id={id} className={`subComp1`}>
        </div>
    )
}

export default SubComp1
