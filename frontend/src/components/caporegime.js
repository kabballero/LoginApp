import React, { useEffect, useState } from 'react';
import Navbar from './navbar';

export default function Capo() {
    const token = localStorage.getItem('token');
    const [data, setData] = useState([]);
    async function fetchData(url, requestOptions) {
        const json = await fetch(url,requestOptions).then(response => response.json()).catch((e) => { console.log(e.message) })
        return json;
    }
    useEffect(() => {
        async function getData() {
            const json = await fetchData(`http://localhost:9103/capoClassified`, {
                method: 'get',
                headers: { 'x-observatory-auth': token, 
                },
            })
            setData(json);
        }
        getData();
    }, [])
    return (<div>
        {data?.length > 0 ? (
            <div>
                <Navbar />
                <h1>{data[0].staff}</h1>
            </div>) : (
            <h1>no data</h1>
        )}
    </div>
    )
} 