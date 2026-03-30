import React from "react";
import { useParams } from "react-router-dom";

const BalancedTimeTable = () => {
  const { batchId } = useParams();

  if (!batchId) {
    return (
      <div className="p-6 text-red-500 font-medium">
        Batch ID missing
      </div>
    );
  }

  return (
    <div className="w-full flex-1 overflow-hidden">
      <iframe
        src={`http://localhost:5000/timetable/visual/${batchId}`}
        title="Timetable Preview"
        className="w-full h-full rounded-lg border-none"
        frameBorder="0"
      />
    </div>
  );
};

export default BalancedTimeTable;
