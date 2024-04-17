import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
      <div className='px-4 py-10'>
          <h1 className='text-2xl'>Youkoso Store</h1>
          <h2 className='text-xl'>Advance Programming A4</h2>
      </div>
  );
}
