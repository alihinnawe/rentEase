"use client"; // Ensure this is at the top of the file if using client-side features
import { useEffect } from "react";
import productData from "../../data/product.json";

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import "../app/style.css";
import useRequireAuth from "../app/hooks/useRequireAuth";

export default function Home() {
  const { session, status } = useRequireAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      console.log("meeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      console.log("Loading products...data", productData);

      try {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ products: productData.products }), // Ensure this is a JSON string
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result); // Log or handle the response data as needed
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <section>
        <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
        {session ? (
          <>
            <img
              src={session.user?.image || "/default-profile.png"}
              alt={session.user?.name || "User"}
              className="profile-image"
            />
            <p className="text-3xl font-bold underline">
              Welcome, {session.user?.name}
            </p>
            <button onClick={() => signOut()}>Sign out</button>
            <div>
              <Link href="/myitems">Go to My Items</Link>
            </div>
          </>
        ) : (
          <>
            <form>
              <legend>Experience Unlimited Rentals from Your Community!</legend>
              <br />
              <fieldset>
                <div className="inputbox">
                  <ion-icon name="mail-outline"></ion-icon>
                  <input type="email" required />
                  <label>Email</label>
                </div>
                <div className="inputbox">
                  <ion-icon name="lock-closed-outline"></ion-icon>
                  <input type="password" required />
                  <label>Password</label>
                </div>
                <div className="forget">
                  <label>
                    <input type="checkbox" />
                    Remember Me
                  </label>
                  <a href="#">Forget Password</a>
                </div>
              </fieldset>
              <button type="submit">Log in</button>
              <div className="register">
                <p>
                  Don't have an account? <a href="#">Register</a>
                </p>
              </div>
            </form>
            <button onClick={() => signIn("google")}>
              Sign in with Google
            </button>
          </>
        )}
      </section>
    </main>
  );
}
