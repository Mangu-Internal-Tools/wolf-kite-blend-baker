export type GenreTab = "LCGFT" | "Popular" | "International" | "Comics";

export type GenreCell = {
  id: string;
  name: string;
  tab: GenreTab;
  note: string;
};

export const GENRES: GenreCell[] = [
  // LCGFT
  { id: "lcgft-domestic", tab: "LCGFT", name: "Domestic fiction", note: "Households, marriages, quiet ruptures" },
  { id: "lcgft-historical", tab: "LCGFT", name: "Historical fiction", note: "Past as pressure, not costume" },
  { id: "lcgft-mystery", tab: "LCGFT", name: "Detective and mystery fiction", note: "Crime as moral architecture" },
  { id: "lcgft-sf", tab: "LCGFT", name: "Science fiction", note: "Systems, futures, consequence" },
  { id: "lcgft-fantasy", tab: "LCGFT", name: "Fantasy fiction", note: "World-rules with costs" },
  { id: "lcgft-romance", tab: "LCGFT", name: "Romance fiction", note: "Want vs. self-knowledge" },
  { id: "lcgft-horror", tab: "LCGFT", name: "Horror fiction", note: "Dread with a thesis" },
  { id: "lcgft-bildungsroman", tab: "LCGFT", name: "Bildungsromans", note: "Becoming, not montage" },
  { id: "lcgft-psych", tab: "LCGFT", name: "Psychological fiction", note: "Interior weather" },
  { id: "lcgft-althist", tab: "LCGFT", name: "Alternative histories", note: "One hinge, many lives" },
  { id: "lcgft-epistolary", tab: "LCGFT", name: "Epistolary fiction", note: "Voice as evidence" },
  { id: "lcgft-noir", tab: "LCGFT", name: "Noir fiction", note: "City as accomplice" },
  // Popular
  { id: "pop-romantasy", tab: "Popular", name: "Romantasy", note: "Court, magic, irreversible want" },
  { id: "pop-dark-ac", tab: "Popular", name: "Dark academia", note: "Archives, ambition, rot" },
  { id: "pop-cozy", tab: "Popular", name: "Cozy mystery", note: "Community, tea, a body" },
  { id: "pop-litrpg", tab: "Popular", name: "LitRPG", note: "Stats as character" },
  { id: "pop-cli-fi", tab: "Popular", name: "Climate fiction", note: "Weather as antagonist" },
  { id: "pop-romantasy-cozy", tab: "Popular", name: "Cozy romantasy", note: "Low-stakes magic, high feeling" },
  { id: "pop-domestic-suspense", tab: "Popular", name: "Domestic suspense", note: "The house knows" },
  { id: "pop-booktok-ya", tab: "Popular", name: "YA rivals-to-lovers", note: "School, status, spark" },
  { id: "pop-found-family", tab: "Popular", name: "Found-family adventure", note: "Crew as home" },
  { id: "pop-second-chance", tab: "Popular", name: "Second-chance romance", note: "Time as the third lover" },
  // International
  { id: "int-magical-realism", tab: "International", name: "Magical realism", note: "Miracle as weather report" },
  { id: "int-nordic-noir", tab: "International", name: "Nordic noir", note: "Cold light, long memory" },
  { id: "int-i-novel", tab: "International", name: "Japanese I-novel", note: "Self as specimen" },
  { id: "int-lagos", tab: "International", name: "Lagos city novel", note: "Hustle, kinship, heat" },
  { id: "int-partition", tab: "International", name: "Partition histories", note: "Border as family wound" },
  { id: "int-caribbean", tab: "International", name: "Caribbean gothic", note: "Island, inheritance, haunt" },
  { id: "int-sao-paulo", tab: "International", name: "São Paulo night fiction", note: "Vertical city, hidden floors" },
  { id: "int-seoul", tab: "International", name: "Seoul workplace noir", note: "Hierarchy as horror" },
  // Comics
  { id: "com-memoir", tab: "Comics", name: "Graphic memoir", note: "Drawn memory, spare captions" },
  { id: "com-decon", tab: "Comics", name: "Superhero deconstruction", note: "Power after the costume" },
  { id: "com-manga-ya", tab: "Comics", name: "Manga-inspired YA", note: "Panel rhythm, school heat" },
  { id: "com-slice", tab: "Comics", name: "Slice-of-life comics", note: "Small rooms, large feeling" },
  { id: "com-myth", tab: "Comics", name: "Myth retelling graphic", note: "Old gods, new linework" },
  { id: "com-reporter", tab: "Comics", name: "Comics journalism", note: "Witness in ink" },
];

export const TABS: GenreTab[] = ["LCGFT", "Popular", "International", "Comics"];
