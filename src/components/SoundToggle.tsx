import { Volume2, VolumeX } from "lucide-react";

type SoundToggleProps = {
  muted: boolean;
  onToggle: () => void;
};

export function SoundToggle({ muted, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={onToggle}
      aria-pressed={muted}
      aria-label={muted ? "Unmute music" : "Mute music"}
    >
      {muted ? <VolumeX size={18} strokeWidth={1.7} /> : <Volume2 size={18} strokeWidth={1.7} />}
    </button>
  );
}
