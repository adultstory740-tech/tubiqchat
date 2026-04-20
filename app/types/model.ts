import { StaticImageData } from "next/image";

export interface Model {
  id: number;
  name: string;
  type: string;
  description: string;
  tagline?: string;
  image?: string | StaticImageData;
}
