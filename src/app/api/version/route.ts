export const GET = async () => {
  return Response.json({
    version: process.env.NEXT_PUBLIC_APP_VERSION || "Unknown",
  });
};
