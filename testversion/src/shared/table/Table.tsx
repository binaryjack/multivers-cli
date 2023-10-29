
import './Table.css';

import React from 'react';

interface ITable {
    id?: string
} 

const Table = ({
    id
    }: ITable): React.JSX.Element => {
    return (
        <div id={id} className={`table`}>
        </div>
    )
}

export default Table
