type SurveyCardProps = {
  id: string;
  question: string;
  options: string[];
  username: string;
  onDelete: () => void;
};

type SurveyItems = {
  username: string;
  id: string;
  question: string;
  options: string[];
  city: string;
  district: string;
  neighborhood: string;
  town: string;
};
