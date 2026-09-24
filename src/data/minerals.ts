export type MineralCategory =
  | "Macrocrystalline quartz"
  | "Microcrystalline silica"
  | "Quartz with inclusions"
  | "Silica replacement material";

export interface Hotspot {
  id: string;
  position: [number, number, number];
  title: string;
  body: string;
}

export interface Mineral {
  id: string;
  code: string;
  name: string;
  varietyOf: string;
  formula: string;
  category: MineralCategory;
  crystalSystem: string;
  hardness: string;
  density: string;
  color: string;
  transparency: string;
  lustre: string;
  formation: string;
  localities: string;
  description: string;
  geology: string;
  // rendering hints
  render: {
    color: string;
    roughness: number;
    transmission: number;
    thickness: number;
    opacity: number;
    transparent?: boolean;
    variant?: "clear" | "amethyst" | "rose" | "smoky" | "citrine" | "milky" | "rutilated" | "agate" | "chalcedony" | "jasper" | "tiger";
  };
  hotspots: Hotspot[];
}

const baseHotspots: Hotspot[] = [
  {
    id: "prism",
    position: [1.05, 0.1, 0.35],
    title: "Caras de prisma — m {10-10}",
    body: "Las seis caras laterales del prisma hexagonal. Suelen mostrar estrías horizontales perpendiculares al eje c, marcas de crecimiento típicas del cuarzo trigonal.",
  },
  {
    id: "termination",
    position: [0.25, 1.55, 0.2],
    title: "Terminación — romboedros R / r",
    body: "El ápice combina romboedro mayor (R) y menor (r). En un cristal ideal forman una pirámide de seis caras; en la naturaleza rara vez son perfectamente simétricas.",
  },
  {
    id: "interior",
    position: [-0.15, 0.35, 0.75],
    title: "Interior y propiedades ópticas",
    body: "El cuarzo es uniaxial positivo (nω ≈ 1.544, nε ≈ 1.553), piezoeléctrico y sin exfoliación. Rompe con fractura concoidea. La transmisión del material en este visor es una aproximación en tiempo real, no una simulación óptica exacta.",
  },
  {
    id: "base",
    position: [0.55, -1.25, -0.3],
    title: "Base y crecimiento",
    body: "La base estuvo anclada a la roca encajante. El crecimiento se produce por circulación hidrotermal de sílice; impurezas-traza y defectos de red definen el color de cada variedad.",
  },
];

export const MINERALS: Mineral[] = [
  {
    id: "clear-quartz",
    code: "QUARTZ 001",
    name: "Clear Quartz",
    varietyOf: "Quartz — rock crystal",
    formula: "SiO₂",
    category: "Macrocrystalline quartz",
    crystalSystem: "Trigonal",
    hardness: "7 Mohs",
    density: "2.65 g/cm³",
    color: "Colourless",
    transparency: "Transparent",
    lustre: "Vitreous",
    formation: "Pegmatites and alpine-type hydrothermal veins; low- to high-temperature SiO₂ precipitation.",
    localities: "Swiss Alps · Minas Gerais (BR) · Arkansas (US) · Madagascar",
    description:
      "Hialine quartz, chemically almost pure SiO₂. Reference variety for the whole family.",
    geology:
      "Crystallises from silica-rich fluids. Its transparency comes from very low trace-element content and few fluid inclusions.",
    render: { color: "#ffffff", roughness: 0.04, transmission: 1, thickness: 1.6, opacity: 1, variant: "clear" },
    hotspots: baseHotspots,
  },
  {
    id: "amethyst",
    code: "QUARTZ 002",
    name: "Amethyst",
    varietyOf: "Quartz — violet variety",
    formula: "SiO₂ (+ Fe⁴⁺ / colour centres)",
    category: "Macrocrystalline quartz",
    crystalSystem: "Trigonal",
    hardness: "7 Mohs",
    density: "2.65 g/cm³",
    color: "Violet to purple",
    transparency: "Transparent to translucent",
    lustre: "Vitreous",
    formation: "Basalt geodes and hydrothermal veins; Fe impurities + natural irradiation create colour centres.",
    localities: "Rio Grande do Sul (BR) · Uruguay (Artigas) · Zambia · Thunder Bay (CA)",
    description:
      "Violet variety coloured by Fe⁴⁺ colour centres formed under natural irradiation. Heat turns it yellow (citrine-like).",
    geology:
      "Dated fluid inclusions show low-temperature growth (<250 °C). Colour zones parallel to rhombohedral faces.",
    render: { color: "#8b6fbf", roughness: 0.08, transmission: 0.92, thickness: 1.4, opacity: 1, variant: "amethyst" },
    hotspots: baseHotspots,
  },
  {
    id: "rose-quartz",
    code: "QUARTZ 003",
    name: "Rose Quartz",
    varietyOf: "Quartz — pink variety",
    formula: "SiO₂ (+ Ti / Mn, fibrous inclusions)",
    category: "Macrocrystalline quartz",
    crystalSystem: "Trigonal",
    hardness: "7 Mohs",
    density: "2.65 g/cm³",
    color: "Pale to medium pink",
    transparency: "Translucent to opaque",
    lustre: "Vitreous to greasy",
    formation: "Core of zoned granitic pegmatites; pink from fibrous borosilicate-related inclusions and Ti.",
    localities: "Minas Gerais (BR) · Madagascar · South Dakota (US) · Eidsvoll (NO)",
    description:
      "Pink quartz that rarely forms euhedral crystals; typically massive. Colour fades with prolonged light exposure.",
    geology:
      "Nanoscale fibrous inclusions scatter light, giving the milky-pink glow and occasional asterism.",
    render: { color: "#eec3c3", roughness: 0.18, transmission: 0.75, thickness: 1.8, opacity: 1, variant: "rose" },
    hotspots: baseHotspots,
  },
  {
    id: "smoky-quartz",
    code: "QUARTZ 004",
    name: "Smoky Quartz",
    varietyOf: "Quartz — brown/grey variety",
    formula: "SiO₂ (+ Al colour centres)",
    category: "Macrocrystalline quartz",
    crystalSystem: "Trigonal",
    hardness: "7 Mohs",
    density: "2.65 g/cm³",
    color: "Brown to grey-black (morion)",
    transparency: "Transparent to translucent",
    lustre: "Vitreous",
    formation: "Granites, pegmatites, alpine clefts; Al impurities + natural gamma irradiation.",
    localities: "Swiss Alps · Cairngorms (UK) · Colorado (US) · Minas Gerais (BR)",
    description:
      "Smoky colour from aluminium-based colour centres. The darkest variety is called morion.",
    geology:
      "Colour intensity correlates with Al content and irradiation dose; heating above ~300 °C bleaches it.",
    render: { color: "#6b5d4f", roughness: 0.1, transmission: 0.85, thickness: 1.3, opacity: 1, variant: "smoky" },
    hotspots: baseHotspots,
  },
  {
    id: "citrine",
    code: "QUARTZ 005",
    name: "Citrine",
    varietyOf: "Quartz — yellow variety",
    formula: "SiO₂ (+ Fe³⁺)",
    category: "Macrocrystalline quartz",
    crystalSystem: "Trigonal",
    hardness: "7 Mohs",
    density: "2.65 g/cm³",
    color: "Pale yellow to amber",
    transparency: "Transparent to translucent",
    lustre: "Vitreous",
    formation: "Pegmatites and hydrothermal veins; natural citrine is rare — most trade citrine is heated amethyst.",
    localities: "Minas Gerais (BR) · Madagascar · Zambia · Spain (Salamanca)",
    description:
      "Yellow quartz coloured by Fe³⁺. Natural material is pale; deep orange stock is usually heat-treated amethyst.",
    geology:
      "Heating amethyst to ~400–500 °C converts Fe⁴⁺ centres to Fe³⁺ precipitates, shifting violet to yellow.",
    render: { color: "#d9a94a", roughness: 0.08, transmission: 0.9, thickness: 1.4, opacity: 1, variant: "citrine" },
    hotspots: baseHotspots,
  },
  {
    id: "milky-quartz",
    code: "QUARTZ 006",
    name: "Milky Quartz",
    varietyOf: "Quartz — white variety",
    formula: "SiO₂ (+ fluid inclusions)",
    category: "Macrocrystalline quartz",
    crystalSystem: "Trigonal",
    hardness: "7 Mohs",
    density: "2.65 g/cm³",
    color: "White",
    transparency: "Translucent to opaque",
    lustre: "Vitreous to greasy",
    formation: "Vein quartz in metamorphic and granitic terrains; abundant microscopic fluid inclusions.",
    localities: "Worldwide — very common vein mineral",
    description:
      "White quartz clouded by countless fluid inclusions and micro-fractures that scatter light.",
    geology:
      "Classic gangue mineral of gold and sulphide veins; its whiteness is optical scattering, not pigment.",
    render: { color: "#f2efe9", roughness: 0.38, transmission: 0.35, thickness: 2.2, opacity: 1, variant: "milky" },
    hotspots: baseHotspots,
  },
  {
    id: "rutilated-quartz",
    code: "QUARTZ 007",
    name: "Rutilated Quartz",
    varietyOf: "Quartz with rutile inclusions",
    formula: "SiO₂ + TiO₂ (rutile needles)",
    category: "Quartz with inclusions",
    crystalSystem: "Trigonal (host) + Tetragonal (rutile)",
    hardness: "7 Mohs (6–6.5 for rutile needles)",
    density: "2.65 g/cm³ (host)",
    color: "Colourless host, golden-red needles",
    transparency: "Transparent (host)",
    lustre: "Vitreous; adamantine needles",
    formation: "Hydrothermal veins where TiO₂ needles are overgrown by quartz.",
    localities: "Minas Gerais (BR) · Madagascar · Swiss Alps · Western Australia",
    description:
      "Clear quartz trapping golden rutile needles — a composite of two minerals, not a chemical variety.",
    geology:
      "Epitaxial rutile grows first; quartz later encloses it preserving the needles in 3D.",
    render: { color: "#ffffff", roughness: 0.06, transmission: 0.98, thickness: 1.5, opacity: 1, variant: "rutilated" },
    hotspots: [
      ...baseHotspots.slice(0, 2),
      {
        id: "rutile",
        position: [0, 0.3, 0.8],
        title: "Agujas de rutilo — TiO₂",
        body: "Cristales aciculares de rutilo (tetragonal, dureza 6–6.5) atrapados durante el crecimiento del cuarzo. Es un composite: dos minerales, no una impureza disuelta.",
      },
      ...baseHotspots.slice(2),
    ],
  },
  {
    id: "agate",
    code: "SILICA 008",
    name: "Agate",
    varietyOf: "Chalcedony — banded",
    formula: "SiO₂ (microcrystalline)",
    category: "Microcrystalline silica",
    crystalSystem: "Trigonal (cryptocrystalline)",
    hardness: "6.5–7 Mohs",
    density: "2.58–2.64 g/cm³",
    color: "Banded multicolour",
    transparency: "Translucent",
    lustre: "Waxy to vitreous",
    formation: "Banding by rhythmic silica deposition in volcanic vesicles (geodes, basalts).",
    localities: "Rio Grande do Sul (BR) · Uruguay · Mexico (Chihuahua) · Botswana · Germany (Idar-Oberstein)",
    description:
      "Banded chalcedony: microscopic quartz fibres in concentric layers. A texture, not a distinct species.",
    geology:
      "Each band records a pulse of silica gel crystallisation; trace Fe/Mn paint the colours.",
    render: { color: "#d8cfc4", roughness: 0.28, transmission: 0.55, thickness: 1.8, opacity: 1, variant: "agate" },
    hotspots: baseHotspots,
  },
  {
    id: "chalcedony",
    code: "SILICA 009",
    name: "Chalcedony",
    varietyOf: "Microcrystalline quartz",
    formula: "SiO₂ (+ moganite intergrowth)",
    category: "Microcrystalline silica",
    crystalSystem: "Trigonal (cryptocrystalline)",
    hardness: "6.5–7 Mohs",
    density: "2.58–2.64 g/cm³",
    color: "Blue-grey to white",
    transparency: "Translucent",
    lustre: "Waxy",
    formation: "Low-temperature precipitation in cavities, often with moganite intergrowth.",
    localities: "Turkey · Namibia · Mexico · USA (Arizona, California)",
    description:
      "Waxy, uniform cryptocrystalline silica. Blue tones come from light scattering (Tyndall), not pigment.",
    geology:
      "Fibre bundles ~100 nm wide; often partially inverts to quartz over geological time.",
    render: { color: "#b9c8d2", roughness: 0.32, transmission: 0.5, thickness: 2.0, opacity: 1, variant: "chalcedony" },
    hotspots: baseHotspots,
  },
  {
    id: "jasper",
    code: "SILICA 010",
    name: "Jasper",
    varietyOf: "Chalcedony — opaque, iron-rich",
    formula: "SiO₂ (+ Fe oxides, up to ~20%)",
    category: "Microcrystalline silica",
    crystalSystem: "Trigonal (cryptocrystalline)",
    hardness: "6.5–7 Mohs",
    density: "2.58–2.91 g/cm³",
    color: "Red, brown, ochre",
    transparency: "Opaque",
    lustre: "Waxy to dull",
    formation: "Silicified sediments / volcanic ash enriched in iron oxides (hematite, goethite).",
    localities: "Madagascar · South Africa · USA (Oregon, California) · India",
    description:
      "Opaque chalcedony coloured by hematite inclusions. Takes a high polish; historic seal stone.",
    geology:
      "Iron content can reach 20%; patterns record sedimentary or brecciated precursors.",
    render: { color: "#9e4a35", roughness: 0.45, transmission: 0.05, thickness: 0.6, opacity: 1, variant: "jasper" },
    hotspots: baseHotspots,
  },
  {
    id: "tigers-eye",
    code: "SILICA 011",
    name: "Tiger's Eye",
    varietyOf: "Quartz-replaced crocidolite",
    formula: "SiO₂ (after Na₂Fe₅Si₈O₂₂(OH)₂)",
    category: "Silica replacement material",
    crystalSystem: "Trigonal (quartz) pseudomorph",
    hardness: "7 Mohs",
    density: "2.64–2.71 g/cm³",
    color: "Golden-brown striped",
    transparency: "Opaque",
    lustre: "Silky (chatoyant)",
    formation: "Silicification of blue asbestos (crocidolite); fibres replaced by quartz preserving alignment.",
    localities: "Northern Cape (ZA) · Western Australia · Namibia",
    description:
      "Not pure quartz: a quartz pseudomorph after crocidolite. Chatoyancy comes from aligned fibres.",
    geology:
      "Classic pseudomorphism textbook case — chemistry is SiO₂ but texture inherits amphibole fibres.",
    render: { color: "#8a5f2e", roughness: 0.35, transmission: 0.08, thickness: 0.7, opacity: 1, variant: "tiger" },
    hotspots: [
      ...baseHotspots.slice(0, 2),
      {
        id: "chatoyancy",
        position: [0, 0.3, 0.85],
        title: "Chatoyancia — ojo de tigre",
        body: "Banda luminosa móvil causada por reflexión en fibras paralelas heredadas de crocidolita. Al girar la pieza, la banda se desplaza — observable en este visor.",
      },
      ...baseHotspots.slice(2),
    ],
  },
];

export function getMineral(id: string): Mineral {
  return MINERALS.find((m) => m.id === id) ?? MINERALS[0];
}
