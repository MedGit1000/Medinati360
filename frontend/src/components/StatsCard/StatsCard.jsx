import React from "react";
import {
  AlertCircle,
  XCircle,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import "./StatsCard.css";

const StatsCard = ({ title, value, type, trend, trendUp }) => {
  const getIcon = () => {
    switch (type) {
      case "total":
        return <AlertCircle size={24} />;
      case "critical":
        return <XCircle size={24} />;
      case "open":
        return <Clock size={24} />;
      case "resolved":
        return <CheckCircle size={24} />;
      default:
        return <AlertCircle size={24} />;
    }
  };

  const getColorClass = () => {
    switch (type) {
      case "critical":
        return "stats-card-critical";
      case "open":
        return "stats-card-warning";
      case "resolved":
        return "stats-card-success";
      default:
        return "stats-card-primary";
    }
  };

  return (
    <div className={`stats-card ${getColorClass()}`}>
      <div className="stats-card-content">
        <div className="stats-card-info">
          <p className="stats-card-title">{title}</p>
          <p className="stats-card-value">{value}</p>
          {trend && (
            <div className="stats-card-trend">
              {trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{trend}</span>
              <span className="trend-period">vs mois dernier</span>
            </div>
          )}
        </div>
        <div className="stats-card-icon">{getIcon()}</div>
      </div>
    </div>
  );
};

export default StatsCard;
