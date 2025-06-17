interface SupportFormProps {
  topic: string;
  description: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  error: string | undefined;
}
