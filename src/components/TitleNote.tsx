import { useRef, useState, type CSSProperties } from "react";

// Where the note was last stuck, relative to its spot in the header
interface Spot {
  x: number;
  y: number;
  tilt: number;
}

// The note's resting tilt at home
const HOME_TILT = -1.4;
// How far the pointer moves before a press becomes a drag
const SLOP = 4;
// Never closer than this to the edge of the page
const MARGIN = 8;

// The title, on its sticky note. A small secret: the note peels off and
// sticks wherever it's dropped, until the page is reloaded. Double-click
// sends it home.
export default function TitleNote() {
  const [spot, setSpot] = useState<Spot | null>(null);
  // Where it is while being carried
  const [carry, setCarry] = useState<{ x: number; y: number } | null>(null);
  const press = useRef<{
    px: number;
    py: number;
    ox: number;
    oy: number;
    // How far it may go each way, so it stays on the page
    min: { x: number; y: number };
    max: { x: number; y: number };
  } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLHeadingElement>) => {
    if (e.button !== 0) return;
    const ox = spot?.x ?? 0;
    const oy = spot?.y ?? 0;
    // Its box at home, in page coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const left = rect.left + window.scrollX - ox;
    const top = rect.top + window.scrollY - oy;
    const page = document.documentElement;
    press.current = {
      px: e.clientX,
      py: e.clientY,
      ox,
      oy,
      min: { x: MARGIN - left, y: MARGIN - top },
      max: {
        x: page.scrollWidth - MARGIN - (left + rect.width),
        y: page.scrollHeight - MARGIN - (top + rect.height),
      },
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const p = press.current;
    if (!p) return;
    const dx = e.clientX - p.px;
    const dy = e.clientY - p.py;
    if (!carry && Math.hypot(dx, dy) < SLOP) return;
    const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
    setCarry({ x: clamp(p.ox + dx, p.min.x, p.max.x), y: clamp(p.oy + dy, p.min.y, p.max.y) });
  };

  const handlePointerUp = () => {
    press.current = null;
    if (!carry) return;
    // Stuck down again at a fresh, slight angle
    const next = { ...carry, tilt: Math.round((Math.random() * 7 - 4) * 10) / 10 };
    setSpot(next);
    setCarry(null);
  };

  const goHome = () => {
    setSpot(null);
  };

  const at = carry ?? spot;
  const style = {
    "--note-x": `${at?.x ?? 0}px`,
    "--note-y": `${at?.y ?? 0}px`,
    "--note-tilt": `${carry ? (spot?.tilt ?? HOME_TILT) + 2.5 : (spot?.tilt ?? HOME_TILT)}deg`,
  } as CSSProperties;

  return (
    <h1
      className={`title ${spot ? "title--moved" : ""} ${carry ? "title--carried" : ""}`}
      style={style}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={goHome}
    >
      Carole Venmo Splitter
    </h1>
  );
}
