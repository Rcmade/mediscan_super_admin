// "use client";
// import useWebName from "@/hooks/useWebName";
// import { client } from "@/lib/rpc";
// import { useQuery } from "@tanstack/react-query";
// import React from "react";
// import { toast } from "sonner";

// const PaymentStatsClient = () => {
//   const { webName } = useWebName();

//   const { data } = useQuery({
//     queryKey: ["payment-stats"],
//     queryFn: async () => {
//       const res = await client.api.main.payments.appointment[
//         "payment-overview"
//       ]["o"][":doctorWebName"]["$get"]({
//         param: {
//           doctorWebName: webName,
//         },
//       });

//       const data = await res.json();
//       if ("error" in data) {
//         toast.error(data.error);
//         throw new Error(data.error);
//       }

//       return data;
//     },
//   });
//   return <pre>{JSON.stringify(data, null, 2)}</pre>;
// };

// export default PaymentStatsClient;
