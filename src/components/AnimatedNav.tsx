import { motion } from "motion/react";
import {
  Home,
  Building2,
  CreditCard,
  Milestone,
  MessageSquareWarning,
} from "lucide-react";

interface AnimatedNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AnimatedNav({
  activeTab,
  onTabChange,
}: AnimatedNavProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "bookings", label: "Bookings", icon: Building2 },
    { id: "milestones", label: "Milestones", icon: Milestone },
    { id: "payments", label: "Payments", icon: CreditCard },
    {
      id: "complaints",
      label: "Support",
      icon: MessageSquareWarning,
    },
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-900/50 border border-gray-800 p-1 rounded-full inline-flex backdrop-blur-xl relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative px-6 py-2.5 rounded-full transition-colors duration-300 z-10"
              style={{ minWidth: "120px" }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              <span
                className={`relative z-10 flex items-center justify-center gap-2 transition-colors duration-300 ${
                  isActive ? "text-white" : "text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}