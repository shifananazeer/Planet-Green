import { Menu } from "lucide-react";

interface Props {
  onMenuClick: () => void;
}

export default function UserHeader({
  onMenuClick,
}: Props) {
  return (
    <header
      className="
        fixed top-0 left-0 right-0
        h-16
        bg-blue-950
        shadow
        z-50
      "
    >
      <div className="h-full px-4 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <button
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu size={24} />
          </button>

          <h1 className="font-bold text-xl text-white">
            Planet  Green
          </h1>
        </div>

        <div className="flex items-center gap-3">

          <div className="text-right hidden md:block text-white">
            <p className="font-medium">
              User
            </p>
            <p className="text-xs text-gray-500">
              Member
            </p>
          </div>

          <img
            src="https://ui-avatars.com/api/?name=User"
            className="w-10 h-10 rounded-full"
          />
        </div>

      </div>
    </header>
  );
}