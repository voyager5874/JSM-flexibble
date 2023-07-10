function isFile(obj: any): obj is File {
  return obj && typeof obj === "object" && "name" in obj && "type" in obj;
}

export const readImage = async (file: any): Promise<string | null> => {
  if (!file || !isFile(file)) return null;

  if (!file.type.includes("image")) {
    return null;
  }

  const reader = new FileReader();

  reader.readAsDataURL(file);
  const result: Promise<string> = new Promise((res) => {
    reader.onload = () => {
      return res(String(reader.result));
    };
  });
  await result;
  return result;
};
