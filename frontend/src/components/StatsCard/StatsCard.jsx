import React from "react";
import {
  AlertCircle,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import "./StatsCard.css";

const StatsCard = ({ title, value, type, trend, trendUp }) => {
  const getIcon = () => {
    switch (type) {
      case "total":
        return <Activity size={24} />;
      case "new":
        return <AlertCircle size={24} />;
      case "progress":
        return <Clock size={24} />;
      case "resolved":
        return <CheckCircle size={24} />;
      default:
        return <AlertCircle size={24} />;
    }
  };

  const getColorClass = () => {
    switch (type) {
      case "new":
        return "stats-card-new";
      case "progress":
        return "stats-card-progress";
      case "resolved":
        return "stats-card-resolved";
      case "total":
        return "stats-card-primary";
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
