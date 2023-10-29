
import './Card.css';

import React from 'react';

interface ICard {
    id?: string
} 

const Card = ({
    id
    }: ICard): React.JSX.Element => {
    return (
        <div id={id} className={`card`}>
        </div>
    )
}

export default Card
