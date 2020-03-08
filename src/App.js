import React, { useState} from 'react';
import ForceTreeChart from './ForceTreeChart.jsx';
import './App.css';

const initialData = {
    name: "A",
    children: [
        {name: 'B', children: [{name:"C"}, {name:"D"}, {name:"E"}]},
        {name: 'F'}
    ]
};

function App() {

    const [data, setData] = useState(initialData);

    return (
        <React.Fragment>
            <h1>Tree Chart</h1>
            <ForceTreeChart data={data}/>
            <button onClick={() => setData(initialData.children[0])}>
                Update Data
            </button>
        </React.Fragment>
    );
}

export default App;
