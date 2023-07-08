import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "@/constant";
import { AuthProviders } from "@/components/AuthProviders";
import { authOptions } from "@/next-auth/auth.options";
import { getServerSession } from "next-auth";
import { LogoutButton } from "@/components/LogoutButton";

export const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <nav className="flexBetween navbar">
      <div className="flex-1 flexStart gap-10">
        <Link href="/">
          <Image src="/logo.svg" width={116} height={43} alt="logo" />
        </Link>
        <ul className="xl:flex hidden text-small gap-7">
          {NavLinks.map((link) => (
            <Link href={link.href} key={link.text}>
              {link.text}
            </Link>
          ))}
        </ul>
      </div>
      <div className="flexCenter gap-4">
        {session?.user ? (
          <>
            <Image
              src={session?.user?.image || "/user.svg"}
              width={40}
              height={40}
              className="rounded-full"
              alt={`${session.user.name}'s avatar`}
            />
            <Link href={"/post-project"}>Share Work</Link>
          </>
        ) : (
          <AuthProviders />
        )}
      </div>
      {session && <LogoutButton />}
    </nav>
  );
};
