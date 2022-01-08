import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Breadcrumbs as Base,
  Anchor,
  useMantineTheme,
  Text,
} from "@mantine/core";

interface Path {
  breadcumb: string;
  href: string;
}

const convertBreadcrumb = (string: string) => {
  return string
    .replace(/-/g, " ")
    .replace(/oe/g, "ö")
    .replace(/ae/g, "ä")
    .replace(/ue/g, "ü");
  //.toUpperCase();
};

export const Breadcrumbs = () => {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState<Path[] | null>(null);
  const theme = useMantineTheme();

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split("/");
      linkPath.shift();

      const pathArray: Path[] = linkPath.map((path, i) => {
        return {
          breadcrumb: path,
          href: "/" + linkPath.slice(0, i + 1).join("/"),
        };
      });

      setBreadcrumbs(pathArray);
    }
  }, [router]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <Base>
      {breadcrumbs.map((breadcrumb, i) => {
        if (i == breadcrumbs.length - 1)
          return (
            <Text
              key={i}
              size="xs"
              color="gray"
              sx={{ lineHeight: 1, alignSelf: "center" }}
            >
              {convertBreadcrumb(breadcrumb.breadcrumb)}
            </Text>
          );
        return (
          <Link href={breadcrumb.href} key={i}>
            <Anchor size="xs" variant="text" href={breadcrumb.href}>
              {convertBreadcrumb(breadcrumb.breadcrumb)}
            </Anchor>
          </Link>
        );
      })}
    </Base>
  );
};

export default Breadcrumbs;
