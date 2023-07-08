export const fetchToken = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/token`
    );
    return response.json();
  } catch (err) {
    throw err;
  }
};
