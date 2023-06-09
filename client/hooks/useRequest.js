import axios from 'axios';
import { useState } from 'react';

export default ({url, method, body,onSuccess}) => {

    const [errors, setErrors] = useState([]);

    const doRequest = async (props = {}) => {

        try {

            setErrors([]);
            const response = await axios[method](url,
                { ...body, ...props}
            );

            if(onSuccess) {
                //impelementar un callback en un hook
                onSuccess(response.data);
            }
            return response.data;

        } catch (error) {
            setErrors(error.response.data.errors);
        }

    }


    return { doRequest, errors };

}