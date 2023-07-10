"use client";
import { useEffect, useState } from "react";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import { AppDialog } from "@/components/AppDialog";

// type Providers = ReturnType<typeof getProviders>;
// type Providers = Record<
//   LiteralUnion<BuiltInProviderType, string>,
//   ClientSafeProvider
// > | null;
export const AuthProviders = () => {
  const [providers, setProviders] = useState<ClientSafeProvider[] | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      const providersArray = res ? Object.values(res) : [];
      setProviders(providersArray);
    };

    fetchProviders().then(() => {});
  }, []);

  return (
    <>
      <AppDialog title={"Please wait"} text={"signing in..."} open={busy} />
      <div>
        {providers?.map((p) => (
          <button
            key={p.id}
            onClick={async () => {
              setBusy(true);
              await signIn(p.id);
              setBusy(false);
            }}
          >
            Sign in with {p.name}
          </button>
        ))}
      </div>
    </>
  );
};
