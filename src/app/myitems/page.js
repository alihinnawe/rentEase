"use client"; // This directive is required to use client-side features like hooks

import useRequireAuth from "../hooks/useRequireAuth"; // Import your custom hook
import "../../app/style.css"; // Assuming the path is correct and `style.css` exists

export default function MyItems() {
  const { session, status } = useRequireAuth(); // Use the custom hook

  if (status === "loading") {
    return <p>Loading...</p>; // Show a loading state while determining the session status
  }

  return (
    <div>
      <h1>My Items</h1>
      <p>Welcome, {session.user?.name}</p>
      <p>Here you can manage your items.</p>
    </div>
  );
}
