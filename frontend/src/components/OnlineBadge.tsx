interface OnlineBadgeProps {
  isOnline: boolean;
  size?: number;
}

export const OnlineBadge = ({ isOnline, size = 10 }: OnlineBadgeProps) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: isOnline ? "#43cc39" : "#9e9e9e",
          boxShadow: isOnline ? "0 0 8px #43cc39" : "none",
          transition: "background-color 0.3s ease",
          flexShrink: 0,
        }}
      />
      <span
        style={{ fontSize: "12px", color: isOnline ? "#2e7d32" : "#757575" }}
      >
        {/* {isOnline ? "Online" : "Offline"} */}
      </span>
    </div>
  );
};
