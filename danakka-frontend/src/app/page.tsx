'use client';
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import CenterSnipper from "../components/Common/CenterSnipper";

export const Page: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/") {
      router.push("/booking/fishing/");
    }
  }, [pathname, router]);

  return <CenterSnipper/>;
};

export default Page;
