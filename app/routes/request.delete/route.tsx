import { json, LoaderFunction } from "@remix-run/node";

export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const requestId = url.pathname.split("/").pop();

  if (request.method.toUpperCase() === "DELETE") {
    const response = await fetch(`http://35.187.235.173/request/delete/${requestId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      return json(null, { status: 204 });
    } else {
      throw new Error(`Error deleting request: ${response.statusText}`);
    }
  }

  return null;
};



import { useNavigate } from "@remix-run/react";

export default function RequestPage({ request }: { request: any }) {
    const navigate = useNavigate();

    const handleDelete = () => {
        navigate(`/request/delete/${request.id}`, { replace: true });
    };

    return (
        <div>
            <h1>{request.product}</h1>
            <button onClick={handleDelete}>Delete Request</button>
        </div>
    );
}