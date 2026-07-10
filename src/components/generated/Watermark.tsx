export function Watermark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div
        className="absolute w-full h-full"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='rgba(0, 0, 0, 0.05)' text-anchor='middle' transform='rotate(-45, 100, 100)' font-family='sans-serif'%3E马鑫祥%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
