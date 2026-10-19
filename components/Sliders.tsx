export function Sliders({
  potential,
  realisation,
  onPotential,
  onRealisation,
}: {
  potential: number;
  realisation: number;
  onPotential: (value: number) => void;
  onRealisation: (value: number) => void;
}) {
  return (
    <div className="sliders">
      <label>
        <span>Savings potential</span>
        <strong>{potential}%</strong>
        <input
          type="range"
          min={2}
          max={8}
          step={1}
          value={potential}
          aria-valuetext={`${potential} percent`}
          onChange={(event) => onPotential(Number(event.target.value))}
        />
      </label>
      <label>
        <span>Realisation</span>
        <strong>{realisation}%</strong>
        <input
          type="range"
          min={30}
          max={100}
          step={1}
          value={realisation}
          aria-valuetext={`${realisation} percent`}
          onChange={(event) => onRealisation(Number(event.target.value))}
        />
      </label>
    </div>
  );
}
