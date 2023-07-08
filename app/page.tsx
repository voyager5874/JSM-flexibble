import Image from "next/image";

export default function Home() {
  return (
    <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      <h1>Categories</h1>
      <h1>Posts</h1>
      <button>LoadMore</button>
    </div>
  );
}
