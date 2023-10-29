import './SubComp2.css'

import React from 'react'

interface ISubComp2 {
    id?: string
}

const SubComp2 = ({ id }: ISubComp2): React.JSX.Element => {
    return <div id={id} className={`subComp2`}></div>
}

export default SubComp2
