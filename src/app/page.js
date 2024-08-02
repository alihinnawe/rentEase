"use client";
import React, { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import styled from "styled-components";
import useSWR from "swr";
import productData from "../../data/product.json"; // Ensure this is the correct path
import useRequireAuth from "../app/hooks/useRequireAuth"; // Import your authentication hook

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding-left: 0;
`;

const ListItem = styled.li`
  position: relative;
  width: 100%;
`;

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const { session, status } = useRequireAuth(); // Ensure this hook is correctly defined and imported
  const [dataLoaded, setDataLoaded] = useState(false);

  // POST data to the server
  const postData = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: productData.products }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Posted products:", result);
      setDataLoaded(true); // Data is successfully posted
    } catch (error) {
      console.error("Error posting products:", error);
    }
  };

  // Trigger data posting and then fetch data
  useEffect(() => {
    const initializeData = async () => {
      await postData(); // Ensure the data is posted first
    };
    initializeData();
  }, []); // Run once on mount

  // Fetch data using SWR
  const { data, error } = useSWR(dataLoaded ? "/api/products" : null, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

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

      <List role="list">
        {data.map((product) => (
          <ListItem key={product._id}>
            <div>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>${product.price}</p>
            </div>
          </ListItem>
        ))}
      </List>
    </main>
  );
}
