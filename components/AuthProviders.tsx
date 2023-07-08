"use client";
import { useEffect, useState } from "react";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";

// type Providers = ReturnType<typeof getProviders>;
// type Providers = Record<
//   LiteralUnion<BuiltInProviderType, string>,
//   ClientSafeProvider
// > | null;
export const AuthProviders = () => {
  const [providers, setProviders] = useState<ClientSafeProvider[] | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      const providersArray = res ? Object.values(res) : [];
      setProviders(providersArray);
    };

    fetchProviders().then(() => {});
  }, []);

  return (
    <div>
      {providers?.map((p) => (
        <button
          key={p.id}
          onClick={() => {
            signIn(p.id);
          }}
        >
          Sign in with {p.name}
        </button>
      ))}
    </div>
  );
};
