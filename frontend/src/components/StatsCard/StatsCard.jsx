import React from "react";
import { AlertCircle, Clock, CheckCircle, Activity } from "lucide-react";

// This lookup object makes the dynamic classes cleaner
const typeStyles = {
  total: {
    value: "text-primary",
    iconBg: "bg-secondary",
    iconText: "text-foreground",
    Icon: Activity,
  },
  new: {
    value: "text-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconText: "text-blue-500",
    Icon: AlertCircle,
  },
  progress: {
    value: "text-yellow-500",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/50",
    iconText: "text-yellow-500",
    Icon: Clock,
  },
  resolved: {
    value: "text-green-500",
    iconBg: "bg-green-100 dark:bg-green-900/50",
    iconText: "text-green-500",
    Icon: CheckCircle,
  },
};

const StatsCard = ({ title, value, type = "total" }) => {
  const styles = typeStyles[type] || typeStyles.total;
  const { Icon } = styles;

  return (
    <div className="bg-background border border-border rounded-lg p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className={`text-4xl font-bold ${styles.value}`}>{value}</p>
        </div>
        <div
          className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${styles.iconBg}`}
        >
          <Icon className={`w-6 h-6 ${styles.iconText}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
