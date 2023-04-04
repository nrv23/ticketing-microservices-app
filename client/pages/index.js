import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {

  console.log({ currentUser });

  return currentUser ? <h1>Está logueado</h1>: <h1>No está logueado</h1>;
};

LandingPage.getInitialProps = async (context) => {
  console.log({context});
  const client = buildClient(context);
  const response = await client.get('/api/users/currentuser');
  return response.data;
}

export default LandingPage;

/*

  // el parametro req es la request de express

  console.log(req.headers);

  if (typeof window === "undefined") {
    // se esta ejecutando del lado del servidor
    console.log("servidor")
    const response = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser", { // el primer parametro es setear la comunicacion con el ingress controller
      headers: req.headers
      
      {
        Host: "ticketing.dev" // asignar el dominio para que el ingress controller pueda manejar la solicitud con las reglas de ruteo del archivo ingress-srv.yml
      }
      
    }
    )

    console.log({ data: response.data });
    return response.data;
  } else {
    // se esta ejecutando desde el browser
    console.log("navegadir")
    const { data } = await axios.get("/api/users/currentuser");
    return data;
  }

*/