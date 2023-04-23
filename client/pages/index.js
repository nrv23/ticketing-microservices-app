import Link from 'next/link';
const LandingPage = ({ currentUser, tickets }) => { // se recibe en los props del componente

  const ticketList = tickets.map(ticket =>(
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`} >
          <a>Ver</a>
        </Link>
      </td>
    </tr>
  ))

  return ( 
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Precio</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>
    </div>
    
  );
};

LandingPage.getInitialProps = async (context,client,currentUser) => {

  const { data: tickets } = await client.get('/api/tickets/');
  
  return { tickets }; // se va fusionar con los props del componente
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