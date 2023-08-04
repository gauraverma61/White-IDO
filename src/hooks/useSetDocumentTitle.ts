import { setDocumentTitle } from "@helpers/setDocumentTitle";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useSetDocumentTitle = (prefix?: string) => {
  const { pathname } = useRouter();
  useEffect(() => {
    setDocumentTitle(pathname, prefix);
  }, [pathname, prefix]);
};
