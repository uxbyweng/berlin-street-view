export type ArtworkBase = {
  title: string;
  artist?: string;
  description: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
};

export type Artwork = ArtworkBase & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};
