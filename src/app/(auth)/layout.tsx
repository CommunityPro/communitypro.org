import type React from "react";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({}: Props) => {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="h-full flex-1"></div>
    </div>
  );
};

export default DashboardLayout;
