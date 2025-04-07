export const transactionSortByArr = ["createdAt", "updatedAt", "total", "due"] as const
export type TransactionSortBy = typeof transactionSortByArr[number]

export const transactionSortOrderArr = ["asc", "desc"] as const
export type TransactionSortOrder = typeof transactionSortOrderArr[number]