import { Button } from "~/ui/components/ui/button";
import { useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";

interface Product {
    id: number;
    productName: string;
    productPrice: number;
    productStock: number;
    productDiscount?: number;
    productDescription: string;
    productImage: string;
}

export async function addToCart(productId: number, token: string): Promise<void> {
    try {
        const response = await fetch(`http://youkoso-product.onrender.com/cart/add/${productId}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to add product to cart');
        }
    } catch (error) {
        console.error("Failed to add product to cart: ", error);
        throw error;
    }
}

export async function loader() {
    try {
        const response = await fetch("http://youkoso-product.onrender.com/products");
        const productData: Product[] = await response.json();
        return { productData };
    } catch (error) {
        console.error("Failed to retrieve products information: ", error);
        throw error;
    }
}

export default function ProductListPage() {
    const { productData } = useLoaderData<typeof loader>();
    const [token, setToken] = useState<string>("");

    useEffect(() => {
        // Retrieve token from session when component mounts
        const storedToken = sessionStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Function to handle adding a product to the cart
    async function handleAddToCart(productId: number) {
        if (!token) {
            // Handle case where user is not authenticated (e.g., redirect to login page)
            return;
        }
        try {
            await addToCart(productId, token);
            // Handle successful addition to cart (e.g., display a success message)
        } catch (error) {
            // Handle errors (e.g., display an error message)
        }
    }

    return (
        <div className="relative w-full px-10 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productData.map((product, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-950">
                    <img
                        alt={product.productName}
                        className="w-full h-60 object-cover"
                        src={product.productImage}
                        style={{
                            aspectRatio: "400/300",
                            objectFit: "cover",
                        }}
                    />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{product.productName}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">{product.productDescription}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold">${product.productPrice}</span>
                            <Button size="sm" onClick={() => handleAddToCart(product.id)}>Add to Cart</Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
