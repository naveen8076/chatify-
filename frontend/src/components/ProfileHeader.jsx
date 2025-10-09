import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="p-6 border-b border-[#2b2b2b] bg-[#0f0f0f]/60 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group ring-1 ring-amber-600/30 hover:ring-amber-500/50 transition-all duration-300"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || '/avatar.png'}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-amber-300 text-xs font-medium">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & STATUS */}
          <div>
            <h3 className="text-amber-300 font-semibold text-base max-w-[180px] truncate">
              {authUser.fullName}
            </h3>
            <p className="text-[#c4c4c4] text-xs tracking-wide">Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 items-center">
          {/* LOGOUT */}
          <button
            className="text-[#a8a8a8] hover:text-amber-400 transition-colors"
            onClick={logout}
            title="Logout"
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* SOUND TOGGLE */}
          <button
            className="text-[#a8a8a8] hover:text-amber-400 transition-colors"
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch((error) =>
                console.log("Audio play failed:", error)
              );
              toggleSound();
            }}
            title="Toggle Sound"
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeader;
