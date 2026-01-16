import clsx from "clsx";
import { Status } from "../../../types";

import { CheckCircle, Hourglass  , XIcon} from "lucide-react";



export const StatusBadge = ({ status }: { status: Status }) => {
  return (
    <div
      className={clsx("flex items-center gap-1 rounded-full px-2 py-1 ", {
        "bg-green-200": status === "scheduled",
        "bg-blue-200": status === "pending",
        "bg-red-200": status === "cancelled",
      })}
    >
        {status === "scheduled" ? (
        <CheckCircle size={12} className="text-green-600" />
      ) : status === "pending" ? (
        <Hourglass size={12} className="text-blue-600" />
      ) : status === "cancelled" ? (
        <XIcon size={12} className="text-red-600" />
      ) : null}
      
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-green-600": status === "scheduled",
          "text-blue-600": status === "pending",
          "text-red-600": status === "cancelled",
        })}
      >
        {status}
      </p>
    </div>
  );
};