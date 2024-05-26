import { Form } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";



export let loader: LoaderFunction = async ({ request }) => {
    if (request.method.toUpperCase() === "POST") {
      const formData = new URLSearchParams(await request.text());
      const product = formData.get("product");
      const quantity = Number(formData.get("quantity"));
      const price = Number(formData.get("price"));
      const currency = formData.get("currency");
  
      const response = await fetch('http://35.187.235.173/request/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product, quantity, price, currency })
      });
  
      if (response.ok) {
        const data = await response.json();
        return json(data, { status: 201 });
      } else {
        return json({ error: `Error creating request: ${response.statusText}` }, { status: response.status });
      }
    }
  
    return null;
  };


export default function CreateRequestPage() {
    return (
      <div>
        <h1>Create Request</h1>
        <Form method="post" action="/request/create">
          <label>
            Product:
            <input type="text" name="product" required />
          </label>
          <label>
            Quantity:
            <input type="number" name="quantity" required />
          </label>
          <label>
            Price:
            <input type="number" name="price" required />
          </label>
          <label>
            Currency:
            <input type="text" name="currency" required />
          </label>
          <button type="submit">Create Request</button>
        </Form>
      </div>
    );
  }