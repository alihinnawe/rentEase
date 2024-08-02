"use client";
import React, { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
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
  margin: 2rem auto;
`;

const ListItem = styled.li`
  position: relative;
  width: 80%;
  max-width: 600px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;

  /* Flex container for images */
  .image-container {
    display: flex;
    flex-wrap: wrap; /* Wrap images to the next line if necessary */
    gap: 1rem; /* Space between images */
    margin-bottom: 1rem; /* Space below the images */
  }

  img {
    width: 100px; /* Fixed width */
    height: 100px; /* Fixed height */
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Shadow for images */
    object-fit: cover; /* Ensures images cover the space without distorting */
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  background-color: #f8f9fa;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

  console.log("Fetched data:", data); // Log data to check structure

  return (
    <>
      <Header>
        {session ? (
          <>
            <img
              src={session.user?.image || "/default-profile.png"}
              alt={session.user?.name || "User"}
              className="profile-image"
              style={{ width: 50, height: 50, borderRadius: "50%" }}
            />
            <p>Welcome, {session.user?.name}</p>
            <button onClick={() => signOut()}>Sign out</button>
          </>
        ) : (
          <>
            <form>
              <legend>Experience Unlimited Rentals from Your Community!</legend>
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
      </Header>
      <main>
        <section style={{ paddingTop: "4rem" }}>
          <List role="list">
            {data.map((product) => (
              <ListItem key={product._id}>
                <div>
                  <h2>{product.name}</h2>
                  <div className="image-container">
                    {product.images.length > 0 ? (
                      product.images.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={`${product.name} image ${index + 1}`}
                        />
                      ))
                    ) : (
                      <p>No images available</p>
                    )}
                  </div>
                  <p>{product.description}</p>
                  <p>Price: ${product.price}</p>
                </div>
              </ListItem>
            ))}
          </List>
        </section>
      </main>
    </>
  );
}
