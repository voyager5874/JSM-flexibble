"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { fetchToken } from "@/next-auth/utils";
import { deleteProjectViaApi } from "@/grafbase/actions.clientside.wrappers";

type Props = {
  projectId: string;
};

export const ProjectActions = ({ projectId }: Props) => {
  const [busy, setBusy] = useState<boolean>(false);
  const router = useRouter();

  const handleDeleteProject = async () => {
    if (!projectId) return;
    setBusy(true);

    const { token } = await fetchToken();

    try {
      const res = await deleteProjectViaApi(projectId, token);
      if (res.status === 200) {
        // const json = await res.json();
        // console.log(json?.message);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Link
        href={`/edit-project/${projectId}`}
        className="flexCenter edit-action_btn p-2"
      >
        <PencilIcon className="p-0 m-0" height={24} />
      </Link>

      <Button
        type="button"
        disabled={busy}
        loading={busy}
        className={`flexCenter delete-action_btn px-2 py-2`}
        onClick={handleDeleteProject}
      >
        <TrashIcon height={24} />
      </Button>
    </>
  );
};
