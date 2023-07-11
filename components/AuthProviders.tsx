"use client";
import { useEffect, useState } from "react";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import { Button } from "@/components/Button";
import { useThrottle } from "@/hooks/useThrottle";
import { BuiltInProviderType } from "next-auth/providers";
import { SignInResponse } from "next-auth/src/react/types";

export const AuthProviders = () => {
  const [providers, setProviders] = useState<ClientSafeProvider[] | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setBusy(true);
    const fetchProviders = async () => {
      const res = await getProviders();
      const providersArray = res ? Object.values(res) : [];
      setProviders(providersArray);
    };

    fetchProviders().then(() => {
      setBusy(false);
    });
  }, []);

  const { throttled, shouldInvoke } = useThrottle<
    BuiltInProviderType | string,
    Promise<SignInResponse | undefined>
  >(signIn, 1000);

  return (
    <div>
      {providers?.map((p) => (
        <Button
          loading={busy || !shouldInvoke}
          disabled={busy || !shouldInvoke}
          key={p.id}
          onClick={async () => {
            setBusy(true);
            await throttled(p.id);
            setBusy(false);
          }}
        >
          Sign in with {p.name}
        </Button>
      ))}
    </div>
  );
};
