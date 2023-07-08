"use client";
import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  const handleClick = () => {
    signOut();
  };
  return <button onClick={handleClick}>logout</button>;
};
