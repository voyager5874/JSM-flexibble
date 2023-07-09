"use client";
import { User } from "next-auth";
import { Project } from "@/grafbase/entities.types";
import { ChangeEvent, FormEvent, Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchToken } from "@/next-auth/utils";
import Image from "next/image";
import { createProjectViaApi } from "@/grafbase/actions.clientside.wrappers";
import { Dialog, Transition } from "@headlessui/react";

type CommonProps = {
  user: Partial<User> | null | undefined;
};
type EditFormProps = CommonProps & { type: "post"; project?: never };
type PostFormProps = CommonProps & { type: "edit"; project: Project };
type Props = PostFormProps | EditFormProps;
export const ProjectForm = ({ type, user, project }: Props) => {
  const router = useRouter();
  const [error, setError] = useState<null | string>(null);
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);

    const { token } = await fetchToken();

    const formData = new FormData(e.target as HTMLFormElement);
    const title = String(formData.get("title"));
    const description = String(formData.get("description"));
    const liveSiteUrl = String(formData.get("liveSiteUrl"));
    const githubUrl = String(formData.get("githubUrl"));
    const category = String(formData.get("category"));

    const allDataProvided =
      title && description && liveSiteUrl && githubUrl && category && user;

    if (!allDataProvided) throw new Error("new project data not provided");
    try {
      if (type === "post") {
        const res = await createProjectViaApi(
          { title, description, liveSiteUrl, githubUrl, category, image },
          user?.id || "nemo",
          token
        );

        if (res.status === 201) {
          router.push("/?success=project successfully posted");
        } else {
          setError(`unexpected operation status code: ${res.status}`);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.includes("image")) {
      alert("Please upload an image!");

      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result as string;

      setImage(result);
    };
  };

  return (
    <>
      <Transition appear show={submitting} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Please wait
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      New Post is being created...
                    </p>
                  </div>

                  <div className="mt-4"></div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-10 items-center lg:min-w-[500px] text-small border-2"
      >
        <div className="form_image-container h-[300px] flex flex-col justify-center">
          <label
            htmlFor="poster"
            className="form_image-label h-1/2 z-10 flexCenter"
          >
            <span>{!image && "Choose a poster for your project"}</span>
            <input
              id="poster"
              name={"image"}
              type="file"
              accept="image/*"
              required={type === "post"}
              className="hidden"
              onChange={(e) => handleChangeImage(e)}
            />
          </label>

          {image && (
            <Image
              src={image}
              className="object-cover"
              alt="project poster z-9"
              fill
            />
          )}
        </div>
        <input
          name={"title"}
          placeholder={"project title"}
          type="text"
          className={"w-full bg-light-white-100 rounded-xl outline-none p-4"}
          defaultValue={project && project.title}
        />
        <input
          name={"description"}
          placeholder={"description"}
          type="text"
          className={"w-full bg-light-white-100 outline-none rounded-xl p-4"}
        />
        <input
          name={"liveSiteUrl"}
          placeholder={"website url"}
          type="text"
          className={"w-full bg-light-white-100 outline-none rounded-xl p-4"}
        />{" "}
        <input
          name={"githubUrl"}
          placeholder={"github Url"}
          type="text"
          className={"w-full bg-light-white-100 outline-none rounded-xl p-4"}
        />{" "}
        <input
          name={"category"}
          placeholder={"project category"}
          type="text"
          className={"w-full bg-light-white-100 outline-none rounded-xl p-4"}
        />
        <button
          disabled={submitting}
          type={"submit"}
          className="bg-blue-500 px-6 py-2 rounded-md"
        >
          Submit
        </button>
        {error && "Something went wrong!"}
      </form>
    </>
  );
};
