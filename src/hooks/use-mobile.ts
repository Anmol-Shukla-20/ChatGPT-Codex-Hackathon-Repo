"use client";

import * as React from "react";

export function useMobile() {
  const [mobile, setMobile] = React.useState(false);
  React.useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return mobile;
}
