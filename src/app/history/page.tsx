import React from "react";
import HistoryClient from "./_HistoryClient";

const HistoryPage = () => {
  return (
    <div className="container mx-auto py-6">
      <h2 className="mb-6 text-2xl font-bold">Your Appointment History</h2>
      <HistoryClient />
    </div>
  );
};

export default HistoryPage;
