const CONFETTI_COLORS = ["#e2603a", "#f3c64b", "#2f8f5b", "#2c5fd6", "#1d1b16"];
const PIECES_PER_BURST = 60;
export const CONFETTI_LIFETIME_MILLISECONDS = 2400;

export type ConfettiPiece = {
  leftVw: number;
  color: string;
  delaySeconds: number;
  rotationDegrees: number;
};

export type ConfettiBurst = {
  id: number;
  pieces: ConfettiPiece[];
};

/** Random pieces are made once per burst, in the event handler, not during render. */
export function createConfettiPieces(): ConfettiPiece[] {
  const pieces: ConfettiPiece[] = [];
  for (let index = 0; index < PIECES_PER_BURST; index++) {
    pieces.push({
      leftVw: Math.random() * 100,
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      delaySeconds: Math.random() * 0.4,
      rotationDegrees: Math.random() * 360,
    });
  }
  return pieces;
}

export function Confetti({ bursts }: { bursts: ConfettiBurst[] }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden motion-reduce:hidden"
    >
      {bursts.map((burst) =>
        burst.pieces.map((piece, index) => (
          <i
            key={`${burst.id}-${index}`}
            className="absolute -top-5 h-[14px] w-[10px] animate-fall rounded-[2px]"
            style={{
              left: `${piece.leftVw}vw`,
              background: piece.color,
              animationDelay: `${piece.delaySeconds}s`,
              transform: `rotate(${piece.rotationDegrees}deg)`,
            }}
          />
        ))
      )}
    </div>
  );
}
