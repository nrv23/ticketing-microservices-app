import { useState } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/useRequest";


export default () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { doRequest, errors } = useRequest({
        url: "/api/users/signup",
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

    return (
        <form onSubmit={submit}>
            <h1>Signup</h1>
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
    )
}