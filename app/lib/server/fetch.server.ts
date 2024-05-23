import { getSession } from "./auth.server";

export type FetchResponse<T> = {
  code: number;
  data: T;
};

export async function globalFetch<T>({
  endpoint,
  body,
  method,
  request,
  isAuthorized,
}: {
  endpoint: string;
  body: any;
  method: string;
  request?: Request;
  isAuthorized?: boolean;
}) {
  let headers = { authorization: "", "Content-Type": "application/json" };

  if (isAuthorized && request) {
    let session = await getSession(request.headers.get("Cookie"));
    let token = session.get("token");
    headers["authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(`${process.env.AUTH_URL}${endpoint}`, {
    method: method,
    headers,
    body: body,
  });

  let returnResponse: FetchResponse<T> = {
    code: response.status,
    data: await response.json(),
  };

  return returnResponse;
}
