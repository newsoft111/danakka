import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const Page = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/") {
      router.push("/booking/fishing/");
    }
  }, [pathname, router]);

  return <div></div>;
};

export default Page;
