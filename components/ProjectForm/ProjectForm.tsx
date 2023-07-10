"use client";
import { User } from "next-auth";
import { Project } from "@/grafbase/entities.types";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchToken } from "@/next-auth/utils";
import Image from "next/image";
import { createProjectViaApi } from "@/grafbase/actions.clientside.wrappers";
import { readImage } from "@/utils/readImage";
import { AppDialog } from "@/components/AppDialog";

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

    const { token } = await fetchToken();

    const formData = new FormData(e.target as HTMLFormElement);
    const title = String(formData.get("title"));
    const description = String(formData.get("description"));
    const liveSiteUrl = String(formData.get("liveSiteUrl"));
    const githubUrl = String(formData.get("githubUrl"));
    const category = String(formData.get("category"));
    const poster = await readImage(formData.get("image"));
    console.log({ image, poster });
    const allDataProvided = Boolean(
      title &&
        description &&
        liveSiteUrl &&
        githubUrl &&
        category &&
        user &&
        image
    );

    if (!allDataProvided) {
      setError("new project data not provided");
      return;
    }
    setSubmitting(true);

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
      setError("Please upload an image!");

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
      <AppDialog
        open={Boolean(error) || submitting}
        text={submitting ? "Processing" : error || ""}
        title={submitting ? "please wait" : (error && "Error!") || ""}
        onClose={() => setError(null)}
      />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-10 items-center lg:min-w-[500px] text-small"
      >
        <div className="form_image-container h-[300px] flex flex-col justify-center">
          <label
            htmlFor="poster"
            className="form_image-label h-full z-10 flexCenter"
          >
            <span>{!image && "Choose a poster for your project"}</span>
            <input
              id="poster"
              name={"image"}
              type="file"
              accept="image/*"
              required={type === "post"}
              className="hidden"
              onChange={handleChangeImage}
            />
          </label>

          {image && (
            <Image
              src={image}
              className="object-contain"
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
          type="url"
          className={"w-full bg-light-white-100 outline-none rounded-xl p-4"}
        />
        <input
          name={"githubUrl"}
          placeholder={"github Url"}
          type="url"
          className={"w-full bg-light-white-100 outline-none rounded-xl p-4"}
        />
        <input
          name={"category"}
          placeholder={"project category"}
          type="text"
          className={"w-full bg-light-white-100 outline-none rounded-xl p-4"}
        />
        <button
          disabled={!image || submitting}
          type={"submit"}
          className="bg-blue-500 px-6 py-2 rounded-md"
          style={{ opacity: `${!image || submitting ? 0.5 : 1}` }}
        >
          Submit
        </button>
        {/*{error && `Something went wrong! ${error}`}*/}
      </form>
    </>
  );
};
