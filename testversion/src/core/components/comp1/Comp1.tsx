
import './Comp1.css';

import React from 'react';

import Card from '../../../shared/card/Card';
import Table from '../../../shared/table/Table';
import Comp2 from '../comp2/Comp2';
import SubComp1 from './components/subComp1/SubComp1';

interface IComp1 {
    id?: string
} 

const Comp1 = ({
    id
    }: IComp1): React.JSX.Element => {
    return (
        <div id={id} className={`comp1`}>
            <SubComp1 />
            <Comp2 />
            <Table />
            <Card />
        </div>
    )
}

export default Comp1
