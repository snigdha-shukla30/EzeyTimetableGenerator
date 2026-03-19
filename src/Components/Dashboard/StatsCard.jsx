import React from "react";

const icons = {
  Classroom: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#265768" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Subjects: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#265768" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  Faculty: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#265768" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  "Time Tables": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#265768" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <circle cx="16" cy="16" r="3"/>
      <polyline points="16 14.5 16 16 17 16"/>
    </svg>
  ),
};

const StatsCard = ({ label, count, imageUrl, selected = false }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "clamp(100px, 20vw, 160px)",
        borderRadius: "10px",
        border: selected ? "2px solid #7C3AED" : "1px solid #DFDFDF",
        boxShadow: "none",
        background: "#ffffff",
        overflow: "visible",
        flexShrink: 0,
      }}
    >
      {/* Image section */}
      <div
        style={{
          height: "clamp(45px, 7vw, 58px)",
          width: "100%",
          overflow: "visible",
          borderRadius: "10px 10px 0 0",
          position: "relative",
          zIndex: 2,
        }}
      >
        <img
          src={imageUrl}
          alt={label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "10px 10px 0 0",
            display: "block",
            transform: hovered ? "translateY(-6px) scale(1.04)" : "translateY(0px) scale(1)",
            transition: "transform 0.25s ease",
          }}
        />
      </div>

      {/* Icon circle */}
      <div
        style={{
          position: "absolute",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "#FFFFFF",
          border: "1.5px solid #BFBFBF",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
          bottom: "34px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        {icons[label]}
      </div>

      {/* Bottom strip */}
      <div
        style={{
          height: "52px",
          borderTop: "1px solid #E5E7EB",
          borderRadius: "0 0 10px 10px",
          padding: "0 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(to bottom, #ffffff 0%, #DFDFDF 100%)",
        }}
      >
        <span
          style={{
            fontFamily: "Mulish, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            color: "#265768",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "65%",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "Mulish, sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            color: "#3B9AB2",
          }}
        >
          {count}
        </span>
      </div>
    </div>
  );
};

export const StatsCardRow = ({ cards }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-start",
      width: "100%",
      gap: "clamp(4px, 0.2vw, 4px)",   // pehle: clamp(8px, 1.5vw, 20px)
      marginTop: "clamp(20px, 5vh, 38px)",
    }}
  >
    {cards.map((card) => (
      <StatsCard key={card.label} {...card} />
    ))}
  </div>
);

export default StatsCard;