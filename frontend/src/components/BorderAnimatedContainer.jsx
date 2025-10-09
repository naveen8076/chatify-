// How to make animated gradient border 👇
// https://cruip-tutorials.vercel.app/animated-gradient-border/
function BorderAnimatedContainer({ children }) {
  return (
    <div
      className="w-full h-full 
      [background:
        linear-gradient(45deg,#0b0b0b,theme(colors.zinc.900)_50%,#0b0b0b)_padding-box,
        conic-gradient(
          from_var(--border-angle),
          rgba(80,80,80,0.4) 75%,
          #b8860b 82%,
          #fbbf24 87%,
          #fcd34d 92%,
          #b8860b 97%,
          rgba(80,80,80,0.4) 100%
        )_border-box
      ]
      rounded-2xl border border-transparent animate-border flex overflow-hidden"
    >
      {children}
    </div>
  );
}

export default BorderAnimatedContainer;
