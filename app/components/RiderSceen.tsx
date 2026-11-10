/* -------------------------------------------------------------------------- */
/* RiderScene: flat shopper road scene (trees, road strip, shopper + cart)     */
/* Drop it anywhere full-width, e.g. between <main> and the footer.            */
/* No images needed: pure SVG, scales to any screen width.                    */
/* -------------------------------------------------------------------------- */

const G1 = '#00AB5E';
const G2 = '#1DB874';
const G3 = '#4CC275';
const GROUND = 153; // y of the road's top edge
const TILE = 700; // width of one repeating group of trees
const HEIGHT = 178;

// Brand colors for the shopper
const PURPLE = '#6B21A8';
const SKIN = '#F2C29B';

// Organic canopy shape, drawn in a 100 x 80 box
const BLOB =
  'M8 40 C2 22 14 8 32 10 C40 2 62 0 72 10 C90 8 102 24 96 40 C104 52 96 70 78 70 C70 80 40 80 30 70 C12 72 2 56 8 40 Z';

type TreeDef = { x: number; w: number; bottom: number; color: string; delay: number };

const TREES: TreeDef[] = [
  { x: 30, w: 100, bottom: 136, color: G2, delay: 0 },
  { x: 205, w: 114, bottom: 138, color: G1, delay: 1.2 },
  { x: 372, w: 94, bottom: 136, color: G1, delay: 0.6 },
  { x: 436, w: 98, bottom: 137, color: G2, delay: 2 },
  { x: 596, w: 96, bottom: 132, color: G3, delay: 1.6 },
];

// Enough copies of the tree group to cover very wide screens
const COPIES = [0, 1, 2, 3, 4];

function Tree({ x, w, bottom, color, delay }: TreeDef) {
  const s = w / 100;
  const top = bottom - 80 * s;
  const cx = x + w / 2;
  const trunkTop = bottom - 14 * s;
  return (
    <g className="rs-sway" style={{ animationDelay: `${delay}s` }}>
      <rect x={cx - 2.5} y={trunkTop} width={5} height={GROUND - trunkTop} fill="#1E3A2B" />
      <path d={BLOB} fill={color} transform={`translate(${x} ${top}) scale(${s})`} />
    </g>
  );
}

function Wheel({ cx, cy, r = 11 }: { cx: number; cy: number; r?: number }) {
  const ring = r * 0.64;
  return (
    <g className="rs-wheel">
      <circle cx={cx} cy={cy} r={r} fill="#151515" />
      <circle cx={cx} cy={cy} r={ring} fill="none" stroke="#3A3A3A" strokeWidth={1} />
      <path
        d={`M${cx - ring} ${cy} H${cx + ring} M${cx} ${cy - ring} V${cy + ring}`}
        stroke="#3A3A3A"
        strokeWidth={1}
      />
      <circle cx={cx} cy={cy} r={r * 0.29} fill="#F5A300" />
    </g>
  );
}

/* A leg: pants + white sneaker. Pivots from the hip. */
function Leg({ back = false }: { back?: boolean }) {
  return (
    <g className={`rs-leg ${back ? 'rs-leg-b' : ''}`}>
      <rect x={27.5} y={36} width={5} height={18} rx={2.5} fill={back ? '#0F172A' : '#1E293B'} />
      <rect x={26} y={53} width={11} height={4} rx={2} fill={back ? '#D9D9D9' : '#fff'} />
      <rect x={26} y={55.5} width={11} height={1.5} rx={0.75} fill={PURPLE} />
    </g>
  );
}

function Shopper() {
  return (
    // wheels/feet are 57 units below the group's origin, so lift it onto the road
    <g transform={`translate(0 ${GROUND - 57})`}>
      <g className="rs-ride">
        <ellipse cx={52} cy={57} rx={50} ry={2} fill="#000" opacity={0.18} />
        <g className="rs-bob">
          {/* ---------- back leg ---------- */}
          <Leg back />

          {/* ---------- shopping bags (carried in back hand) ---------- */}
          <g className="rs-swing">
            {/* pink bag behind */}
            <path d="M12 35 Q15 29 18 35" fill="none" stroke="#BE185D" strokeWidth={1.2} />
            <rect x={8} y={35} width={11} height={13} rx={2} fill="#F472B6" />
            {/* yellow bag in front */}
            <path d="M17 33 Q21.5 26 26 33" fill="none" stroke="#B45309" strokeWidth={1.2} />
            <rect x={14} y={33} width={14} height={16} rx={2} fill="#FFC400" />
            <rect x={14} y={33} width={14} height={3.5} rx={1.5} fill="#E6A800" />
            <circle cx={21} cy={42} r={3.6} fill="#fff" />
            <text
              x={21}
              y={44.6}
              textAnchor="middle"
              fontSize={6.5}
              fontWeight={800}
              fill={PURPLE}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              K
            </text>
          </g>

          {/* ---------- body ---------- */}
          <rect x={23} y={15} width={15} height={23} rx={6} fill={PURPLE} />
          <rect x={23} y={34} width={15} height={4} rx={2} fill="#4C1D95" />
          {/* head + hair */}
          <circle cx={31} cy={9} r={6.4} fill={SKIN} />
          <path d="M24.6 9 Q24 1.6 31 2.2 Q38 2.4 37.4 9 Q34 4.8 24.6 9 Z" fill="#2B1B12" />
          <circle cx={34} cy={9.4} r={0.9} fill="#2B1B12" />
          {/* front leg */}
          <Leg />

          {/* back arm holding the bags */}
          <path d="M28 19 L22.5 29" stroke="#581C87" strokeWidth={4.6} strokeLinecap="round" />
          <circle cx={22} cy={30.4} r={2.4} fill={SKIN} />

          {/* ---------- cart ---------- */}
          {/* handle */}
          <path
            d="M46 27.5 H52 L55 31"
            fill="none"
            stroke="#151515"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* products sitting in the cart (bottoms hidden behind the basket) */}
          {/* sneaker */}
          <path
            d="M55 36 V25 Q55 21.5 58.5 21.5 H61 Q62 26 67 27 Q71 28 71 36 Z"
            fill="#EF4444"
          />
          <path d="M58.5 24 L62 27 M59.5 26.5 L63 29.5" stroke="#fff" strokeWidth={1} strokeLinecap="round" />
          <rect x={54} y={29.5} width={18} height={3.2} rx={1.6} fill="#fff" />
          {/* handbag */}
          <path d="M73 26 Q77 17 81 26" fill="none" stroke="#92400E" strokeWidth={1.8} strokeLinecap="round" />
          <rect x={71.5} y={25} width={11} height={12} rx={2.5} fill="#F59E0B" />
          <circle cx={77} cy={29.5} r={1.2} fill="#fff" />
          {/* t-shirt */}
          <g transform="rotate(6 90 28)">
            <path
              d="M83 21.5 L88 18.5 Q90.5 21.5 93 18.5 L98 21.5 L96 27 L94 26 L94 37 L86 37 L86 26 L84 27 Z"
              fill="#38BDF8"
            />
            <path d="M88 18.5 Q90.5 21.5 93 18.5" fill="none" stroke="#0284C7" strokeWidth={1.2} />
          </g>

          {/* basket */}
          <path d="M52 30 H100 L94 47 H58 Z" fill="#E9D5FF" stroke={PURPLE} strokeWidth={1.4} strokeLinejoin="round" />
          <path d="M54.5 38.5 H97.2 M70 30 L72 47 M86 30 L85 47" stroke={PURPLE} strokeWidth={0.9} opacity={0.55} />
          <rect x={51} y={28.6} width={50} height={2.8} rx={1.4} fill={PURPLE} />
          {/* K badge */}
          <circle cx={76} cy={38.5} r={4.6} fill="#fff" />
          <text
            x={76}
            y={41.5}
            textAnchor="middle"
            fontSize={8}
            fontWeight={800}
            fill={PURPLE}
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            K
          </text>
          {/* cart legs + wheels */}
          <path d="M60 47 L58.5 52 M92 47 L93.5 52" stroke="#151515" strokeWidth={2} strokeLinecap="round" />
          <Wheel cx={58.5} cy={51.5} r={5.5} />
          <Wheel cx={93.5} cy={51.5} r={5.5} />

          {/* front arm pushing the cart (drawn last so it sits on the handle) */}
          <path d="M33 19 L44 27" stroke={PURPLE} strokeWidth={4.6} strokeLinecap="round" />
          <circle cx={46} cy={28} r={2.5} fill={SKIN} />
        </g>
      </g>
    </g>
  );
}

const CSS = `
  .rs-ride { animation: rs-drive 18s linear infinite; }
  @keyframes rs-drive {
    from { transform: translateX(-160px); }
    to   { transform: translateX(calc(100vw + 40px)); }
  }
  .rs-bob { animation: rs-bob .4s ease-in-out infinite alternate; }
  @keyframes rs-bob {
    from { transform: translateY(0); }
    to   { transform: translateY(-1.2px); }
  }
  .rs-wheel {
    transform-box: fill-box;
    transform-origin: 50% 50%;
    animation: rs-spin .9s linear infinite;
  }
  @keyframes rs-spin { to { transform: rotate(360deg); } }
  .rs-leg {
    transform-box: fill-box;
    transform-origin: 50% 0%;
    animation: rs-step .5s ease-in-out infinite alternate;
  }
  .rs-leg-b { animation-direction: alternate-reverse; }
  @keyframes rs-step {
    from { transform: rotate(-24deg); }
    to   { transform: rotate(24deg); }
  }
  .rs-swing {
    transform-box: fill-box;
    transform-origin: 50% 0%;
    animation: rs-swing .5s ease-in-out infinite alternate;
  }
  @keyframes rs-swing {
    from { transform: rotate(8deg); }
    to   { transform: rotate(-8deg); }
  }
  .rs-sway {
    transform-box: fill-box;
    transform-origin: 50% 100%;
    animation: rs-sway 6s ease-in-out infinite alternate;
  }
  @keyframes rs-sway {
    from { transform: rotate(-0.8deg); }
    to   { transform: rotate(0.8deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .rs-ride, .rs-bob, .rs-wheel, .rs-sway, .rs-leg, .rs-swing { animation: none; }
    .rs-ride { transform: translateX(22vw); }
  }
`;

export default function RiderScene({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden bg-white ${className}`} aria-hidden="true">
      <style>{CSS}</style>
      <svg width="100%" height={HEIGHT} className="block" role="presentation" focusable="false">
        <defs>
          {/* road: dark green band with interlocking light-green arches */}
          <pattern id="rs-road" width={64} height={18} patternUnits="userSpaceOnUse">
            <rect width={64} height={18} fill="#004D2C" />
            <path
              d="M0 16 C8 1 24 1 32 16 M32 2 C40 17 56 17 64 2"
              fill="none"
              stroke="#12C47E"
              strokeWidth={3.5}
              strokeLinecap="round"
            />
          </pattern>
          {/* water strip under the road */}
          <pattern id="rs-water" width={40} height={7} patternUnits="userSpaceOnUse">
            <rect width={40} height={7} fill="#8FC8F8" />
            <rect x={34} width={6} height={7} fill="#004D2C" />
          </pattern>
        </defs>

        {COPIES.map((c) =>
          TREES.map((t, i) => (
            <g key={`${c}-${i}`} transform={`translate(${c * TILE} 0)`}>
              <Tree {...t} />
            </g>
          ))
        )}

        <g transform={`translate(0 ${GROUND})`}>
          <rect width="100%" height={18} fill="url(#rs-road)" />
          <rect y={18} width="100%" height={7} fill="url(#rs-water)" />
        </g>

        <Shopper />
      </svg>
    </div>
  );
}