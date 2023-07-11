"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { categoryOptions } from "@/constant";

export const Categories = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category");

  const handleTags = (item: string) => {
    router.push(`${pathName}?category=${item}`);
  };

  return (
    <div className="flexBetween w-full gap-5 flex-wrap">
      <ul className="flex gap-2 overflow-auto">
        {categoryOptions.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleTags(cat.title)}
            className={`${
              category === cat.title
                ? "bg-light-white-300 font-medium"
                : "font-normal"
            } px-4 py-3 rounded-lg capitalize whitespace-nowrap`}
          >
            {cat.title}
          </button>
        ))}
      </ul>
    </div>
  );
};
