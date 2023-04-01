import { useState } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/useRequest";
// test3@gmail.com/123456

export default () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {doRequest,errors} = useRequest({
        url: "/api/users/signin",
        method: "post",
        body: {
            email,
            password
        },
        onSuccess: () => Router.push("/")
    }) 

    const submit = async e => {

        e.preventDefault();

       await doRequest();
       
    }

    return <div className="container">
        <form onSubmit={submit}>
            <h1>Sign In</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="text" className="form-control" />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" />
            </div>
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
            <button className="btn btn-primary">
                Submit
            </button>
        </form>
    </div>
}