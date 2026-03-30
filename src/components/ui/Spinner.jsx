// SRP: Renders a loading spinner — nothing else.

export default function Spinner({ size = 20 }) {
  return (
    <span style={{
      display: "inline-block",
      width: size, height: size,
      border: "3px solid #e2e8f0",
      borderTop: "3px solid #6366f1",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }} />
  );
}
