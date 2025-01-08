interface ChatHeaderProps {
  characterName: string;
}

export function ChatHeader({ characterName }: ChatHeaderProps) {
  return (
    <div className="flex items-center">
      <h1 className="text-xl font-semibold text-white">
        {characterName}
      </h1>
    </div>
  );
}