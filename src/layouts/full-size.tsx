import React from "react";

type LayoutProps = {
  children?: React.ReactNode
}

export default function FullSizeLayout({ children }: LayoutProps) {
  return (
    <>
      {children}
    </>
  );
}
