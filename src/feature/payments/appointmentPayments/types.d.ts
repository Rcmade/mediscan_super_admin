import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

export type PaymentOverviewResponseT = InferResponseType<typeof client.api.main.payments.appointment["payment-overview"]["o"][":doctorWebName"]['$get'],200>;