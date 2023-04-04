import axios from 'axios';

export default ({req}) => {
    console.log({req: req?.headers});
    if (typeof window === "undefined") {

        // desde el servidor
        console.log("Desde el servidor");

        return axios.create({
            baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
            headers: req.headers
        })

    } else {

        // desde el navegador
        console.log("Desde el navegador");

        return axios.create({
            baseURL: "/"
        })
    }
}