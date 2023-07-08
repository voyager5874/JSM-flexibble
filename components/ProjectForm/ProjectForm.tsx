"use client";
import { User } from "next-auth";
import { Project } from "@/grafbase/entities.types";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchToken } from "@/next-auth/utils";
import Image from "next/image";
import { createProjectViaApi } from "@/grafbase/actions.clientside.wrappers";

type CommonProps = {
  user: Partial<User>; //user has to be there since the Link is only available while signed in
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
    if (!title || !description || !liveSiteUrl) throw new Error("no data");
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
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-10 items-center lg:pt-24 pt-12 text-lg min-w-800px max-w-5xl mx-auto border-2"
    >
      <div className="flexStart form_image-container">
        <label htmlFor="poster" className="flexCenter form_image-label">
          {!image && "Choose a poster for your project"}
        </label>
        <input
          id="poster"
          name={"image"}
          type="file"
          accept="image/*"
          required={type === "post"}
          className="form_image-input"
          onChange={(e) => handleChangeImage(e)}
        />
        {image && (
          <Image
            src={image}
            className="sm:p-10 object-contain z-20"
            alt="project poster"
            fill
          />
        )}
      </div>
      <input
        name={"title"}
        placeholder={"project title"}
        type="text"
        className={"w-full bg-light-white-100 rounded-xl p-4"}
        defaultValue={project && project.title}
      />
      <input
        name={"description"}
        placeholder={"description"}
        type="text"
        className={"w-full bg-light-white-100 rounded-xl p-4"}
      />
      <input
        name={"liveSiteUrl"}
        placeholder={"website url"}
        type="text"
        className={"w-full bg-light-white-100 rounded-xl p-4"}
      />{" "}
      <input
        name={"githubUrl"}
        placeholder={"github Url"}
        type="text"
        className={"w-full bg-light-white-100 rounded-xl p-4"}
      />{" "}
      <input
        name={"category"}
        placeholder={"project category"}
        type="text"
        className={"w-full bg-light-white-100 rounded-xl p-4"}
      />
      <button
        disabled={submitting}
        type={"submit"}
        className="bg-blue-500 p-4 rounded-md"
      >
        Submit
      </button>
      {error && "Something went wrong!"}
    </form>
  );
};
