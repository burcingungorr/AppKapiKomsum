export interface TitleProps {
  title: string;
}

export interface HelperCardProps {
  topic: string;
  title: string;
  content: string;
  username: string;
  date: string;
  imageUrl?: string;
  onDelete: () => void;
  onMessagePress?: (username: string) => void;
}

export interface LocationProps {
  onLocationSelected: (
    province: string,
    district: string,
    town: string,
    neighbourhood: string,
  ) => void;
}

export interface HelperCardListProps {
  selectedCategory: string | null;
  selectedLocation: {
    province: string | null;
    district: string | null;
    town: string | null;
    neighbourhood: string | null;
  } | null;
}

export type SelectCategoryProps = {
  onCategorySelect: (category: string) => void;
};

export type InputProps = {
  setTitle: (text: string) => void;
  setDescription: (text: string) => void;
  setCategory: (text: string) => void;
  setLocation: (location: LocationType) => void;
  onImageUploaded: any;
};

export type LocationType = {
  province: string;
  district: string;
  town: string;
  neighbourhood: string;
};

export interface Neighbourhood {
  name: string;
}

export interface Town {
  Town: string;
  ZipCode: string;
  Neighbourhoods: string[];
}

export interface District {
  District: string;
  Coordinates: string;
  Towns: Town[];
}

export interface Province {
  Province: string;
  PlateNumber: number;
  Coordinates: string;
  Districts: District[];
}

export type Helper = {
  id: string;
  title: string;
  username: string;
  action: string;
  date: string;
};

export interface AllHelpersCardProps {
  title: string;
  username: string;
  action: string;
  date: string;
  onDelete: () => void;
}

export interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
}
export interface FiltreProps {
  onCategorySelect: (category: string | null) => void;
  onLocationSelect: (location: LocationType) => void;
}
