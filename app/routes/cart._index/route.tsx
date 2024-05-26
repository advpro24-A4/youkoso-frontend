import { Button } from "~/ui/components/ui/button";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

interface CartItem {
    id: number;
    productName: string;
    productPrice: number;
    quantity: number;
}

export async function removeFromCart(productId: number, token: string): Promise<void> {
    try {
        const response = await fetch(`http://youkoso-product.onrender.com/cart/remove/${productId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to remove product from cart');
        }
    } catch (error) {
        console.error("Failed to remove product from cart: ", error);
        throw error;
    }
}

export async function loader() {
    try {
        const response = await fetch("http://youkoso-product.onrender.com/cart", {
            headers: {
                "Authorization": "Bearer YourAuthToken" // Replace YourAuthToken with the actual token
            }
        });
        const cartItems: CartItem[] = await response.json();
        return { cartItems };
    } catch (error) {
        console.error("Failed to retrieve cart items: ", error);
        throw error;
    }
}

export default function CartPage() {
    const { cartItems } = useLoaderData<typeof loader>();
    const [token, setToken] = useState<string>("");

    // Function to handle removing a product from the cart
    async function handleRemoveFromCart(productId: number) {
        if (!token) {
            // Handle case where user is not authenticated (e.g., redirect to login page)
            return;
        }
        try {
            await removeFromCart(productId, token);
            // Handle successful removal from cart (e.g., display a success message)
        } catch (error) {
            // Handle errors (e.g., display an error message)
        }
    }

    return (
        <div className="relative w-full px-10 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cartItems.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-950">
                    <h3 className="text-lg font-semibold mb-2">{item.productName}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Quantity: {item.quantity}</p>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">${item.productPrice}</span>
                        <Button size="sm" onClick={() => handleRemoveFromCart(item.id)}>Remove</Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
