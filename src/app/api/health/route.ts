export const GET = () => {
  return Response.json(
    {
      status: "ok",
      message: "API is running",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    {
      status: 200,
    },
  );
};
