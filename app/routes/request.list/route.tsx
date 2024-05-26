import { json, LoaderFunction } from "@remix-run/node";
import { Separator } from "~/ui/components/ui/separator";
import { Button } from "~/ui/components/ui/button";
import { Link, useLoaderData } from "@remix-run/react";
import {requireAuthCookie} from "~/lib/server/auth.server";
import { redirectWithInfo } from "remix-toast";


interface Request {
    id: string;
    quantity: number;
    price: number;
    product: string;
    currency: string;
  }


  export let loader: LoaderFunction = async ({ request }) => {
    const response = await fetch('http://35.187.235.173/request/list', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
  
    if (response.ok) {
      const data: Request[] = await response.json();
      return json(data);
    } else if (response.status === 404) {
      // Return a specific error message for NOT_FOUND status
      return json({ error: 'Sorry, there is no request available.' });
    } else if (response.status === 500) {
      // Return a specific error message for Internal Server Error
      return json({ error: 'Sorry, there was an internal server error.' });
    } else {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
  };
  
  export default function RequestListPage() {
    let data: Request[] | { error: string } = useLoaderData();
  
    if ('error' in data) {
      return <div>{data.error}</div>;
    }
  
    return (
      <div>
        <h1>Request List</h1>
        {data.map((request) => (
          <div key={request.id}>
            <h2>{request.product}</h2>
            <p>Quantity: {request.quantity}</p>
            <p>Price: {request.price}</p>
            <p>Currency: {request.currency}</p>
          </div>
        ))}
      </div>
    );
  }