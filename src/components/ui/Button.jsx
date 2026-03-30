export const Button = ({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
  marginClass = "",
}) => {
  const baseStyle = "flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]";

  const variants = {
    // Large Blue Gradient (Login/Signup)
    primary: `
      w-full max-w-[371px] h-[42px]
      rounded-[6px]
      bg-[linear-gradient(0deg,#265768_0%,#4BACCE_100%)]
      drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
      hover:shadow-[inset_0px_4px_10px_rgba(0,0,0,0.35)]
      font-playfair font-semibold text-[24px] text-white
    `,

    // Gray Button
    secondary: `
      px-4 h-[34px]
      rounded-[4px]
      bg-white border-[2px] border-[#DFDFDF]
      font-mulish font-medium text-[12px] text-[#265768]
      hover:bg-gray-50
    `,

    // Blue Gradient, 40px height with icon space (Data Entry pages)
    addMain: `
      h-[40px] w-[180px] 
      rounded-[6px]
      bg-[linear-gradient(0deg,#265768_0%,#4BACCE_100%)]
      drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
      hover:shadow-[inset_0px_4px_10px_rgba(0,0,0,0.35)]
      font-playfair font-medium text-sm text-white
      flex items-center justify-center gap-2
    `,

    // Blue Gradient, 34px height (Manual Entry upload)
    upload: `
      h-[34px] px-4 min-w-[170px]
      rounded-[6px]
      bg-[linear-gradient(0deg,#265768_0%,#4BACCE_100%)]
      shadow-[0_2px_4px_rgba(0,0,0,0.12)]
      hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)]
      font-mulish font-medium text-[12px] text-white
    `,

    // Link style with sliding underline (Manual Entry forms)
    addItem: `
      h-[40px] px-2 w-fit
      bg-transparent
      text-[#265768] font-mulish font-bold text-[15px]
      flex items-center justify-center gap-2
      relative group transition-all
    `,

    // Red Action (Delete)
    danger: `
      px-4 h-[34px]
      rounded-[6px]
      bg-[#F04438] text-white
      font-mulish font-medium text-[12px]
      hover:bg-[#D93F34]
    `,

    // Green Action (Success)
    success: `
      px-4 h-[34px]
      rounded-[6px]
      bg-[#28a745] text-white
      font-mulish font-medium text-[12px]
      hover:bg-[#218838]
    `,

    // Icon only buttons (transparent with hover)
    ghostIcon: `
      bg-transparent border-none p-1
      text-[rgba(38,87,104,0.5)]
      hover:text-[rgba(38,87,104,0.8)]
      transition-colors
    `,

    secondaryIcon: `
      w-[170px] h-[50px]
      rounded-[5px]
      bg-white border-[2px] border-[#26576833]
      font-mulish font-semibold text-[20px]
      bg-gradient-to-t from-[#265768] to-[#4BACCE] bg-clip-text text-transparent
      opacity-50 hover:opacity-100
      transition-all
    `,

    // Back Button (White/Transparent with accent border)
    back: `
      px-10 h-[42px]
      rounded-[6px]
      bg-white border-[1.5px] border-[#26576833]
      font-mulish font-semibold text-[18px] text-[#265768]
      hover:bg-gray-50
      shadow-sm
    `,

    // Download Button (Teal/Dark Blue Gradient)
    download: `
      px-8 h-[42px]
      rounded-[6px]
      bg-[linear-gradient(272deg,#167291_0%,#174264_100%)]
      shadow-[0_4px_10px_rgba(0,0,0,0.2)]
      font-mulish font-semibold text-[18px] text-white
      hover:opacity-90
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || ""} ${marginClass} ${className} ${disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}`}
    >
      {variant === "addItem" ? (
        <span className="relative py-1">
          {children}
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4BACCE] transition-all duration-300 group-hover:w-full"></span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};











