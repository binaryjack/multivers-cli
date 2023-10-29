
import './Comp2.css';

import React from 'react';

import Card from '../../../shared/card/Card';
import Table from '../../../shared/table/Table';
import SubComp2 from './components/subComp2/SubComp2';

interface IComp2 {
    id?: string
} 

const Comp2 = ({
    id
    }: IComp2): React.JSX.Element => {
    return (
        <div id={id} className={`comp2`}>
            <SubComp2 />
            <Table />
            <Card />
        </div>
    )
}

export default Comp2
