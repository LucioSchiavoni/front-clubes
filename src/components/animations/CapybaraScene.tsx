
const hotspots = [
  {
    id: "capibara1",
    style: "top-[65%] left-[5%]",
    title: "Capibara con hélice",
  },
  {
    id: "capibara2",
    style: "top-[58%] left-[38%]",
    title: "Capibara con lentes 3D",
  },
  {
    id: "capibara3",
    style: "top-[60%] left-[75%]",
    title: "Capibara con chicle",
  },
];

export default function CapybaraScene() {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <img
        src="/socialclub.jpeg"
        alt="Capybaras Social Club"
        className="w-full h-auto"
      />

      {hotspots.map((spot) => (
        <div
          key={spot.id}
          title={spot.title}
          className={`absolute w-20 h-28 rounded-full transition-transform duration-300 hover:scale-110 hover:brightness-125 cursor-pointer ${spot.style}`}
        ></div>
      ))}
    </div>
  );
}
