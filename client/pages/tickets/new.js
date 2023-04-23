import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';
const NewTicker = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');

    const { doRequest, errors } = useRequest({
        method: "post",
        body: {
            price,
            title
        },
        url: "/api/tickets",
        onSuccess: (() => Router.push("/"))
    })

    const submit = async (e) => {

        e.preventDefault();

        console.log({price, title});

        await doRequest()
    }

    const onBlur = e => {

        const value = parseFloat(price);

        if(isNaN(value)) {
            return;
        }

        setPrice(value.toFixed(2));
    }

    return (
        <div>
            <h1>Create a Ticker</h1>
            {
                errors.length > 0 && (
                    <div className="alert alert-danger">
                        <h4>Ooops....</h4>
                        <ul className="my-0">
                            {
                                errors.map(err => <li key={err.message}>{err.message}</li>)
                            }
                        </ul>
                    </div>
                )
            }
            <form onSubmit={submit}>
                <div className="form-group">
                    <label htmlFor="">Title</label>
                    <input onChange={e => setTitle(e.target.value)} type="text" className="form-control" id="title" placeholder="Type a Title" value={title} />
                </div>
                <div className="form-group">
                    <label htmlFor="">Price</label>
                    <input 
                        onChange={e => setPrice(e.target.value)} 
                        onBlur= { onBlur }
                        type="number" 
                        className="form-control" 
                        id="price"
                        placeholder="Type a price" 
                        value={price} />
                </div>

                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default NewTicker;