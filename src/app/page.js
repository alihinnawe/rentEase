"use client"; // This directive is required to use client-side features like hooks

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import "../app/style.css";
import useRequireAuth from "../app/hooks/useRequireAuth";

export default function Home() {
  const { session, status } = useRequireAuth();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <section>
        {session ? (
          <>
            <img
              src={session.user?.image || "/default-profile.png"}
              alt={session.user?.name || "User"}
              className="profile-image"
            />
            <p>Welcome, {session.user?.name}</p>
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
