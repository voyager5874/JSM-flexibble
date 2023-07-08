import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "@/constant";
import { AuthProviders } from "@/components/AuthProviders";
import { authOptions } from "@/next-auth/auth.options";
import { getServerSession } from "next-auth";
import { ProfileMenu } from "@/components/ProfileMenu";

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
            <ProfileMenu user={session?.user} />
            <Link href={"/post-project"}>Share</Link>
          </>
        ) : (
          <AuthProviders />
        )}
      </div>
    </nav>
  );
};
