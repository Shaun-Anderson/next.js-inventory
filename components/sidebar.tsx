import Link from "next/link";
import styles from "./layout.module.css";
import {
  UnstyledButton,
  Group,
  ThemeIcon,
  Text,
  Title,
  Avatar,
  Navbar,
} from "@mantine/core";
import { Laptop, HardDrives, Database } from "phosphor-react";
import { useRouter } from "next/router";
import { createStyles } from "@mantine/core";
import { supabase } from "../utils/supabaseClient";
import { useEffect, useState } from "react";
import { NavbarSection } from "@mantine/core/lib/components/AppShell/Navbar/NavbarSection/NavbarSection";

const useStyles = createStyles((theme) => ({
  button: {
    color: theme.white,
    backgroundColor: theme.colors.white,
    border: 0,
    borderRadius: theme.radius.sm,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    cursor: "pointer",
    //margin: theme.spacing.xs,

    // Use pseudo-classes just like you would in Sass
    "&:hover": {
      backgroundColor: theme.colors.gray[0],
    },
  },
  active: {
    backgroundColor: theme.colors.gray[1],
    color: theme.white,
  },
}));

export default function Sidebar({ session }: any) {
  const router = useRouter();
  const { classes, cx } = useStyles();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      console.log(user);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }
      console.log(data);

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Navbar width={{ base: 300 }} height={"100%"} padding="xs">
      <Navbar.Section>
        <Title order={2} sx={{ padding: 10 }}>
          Inventory
        </Title>
      </Navbar.Section>
      <Navbar.Section grow mt="lg">
        <UnstyledButton
          className={cx(classes.button, {
            [classes.active]: router.pathname == "/",
          })}
          onClick={() => router.push("/")}
          type="button"
          style={{ width: "100%" }}
        >
          <Group>
            <ThemeIcon variant="light">
              <Laptop weight="bold" />
            </ThemeIcon>
            <Text size="sm">Systems</Text>
          </Group>
        </UnstyledButton>

        <UnstyledButton
          className={cx(classes.button, {
            [classes.active]: router.pathname == "/servers",
          })}
          onClick={() => router.push("/servers")}
          type="button"
          style={{ width: "100%" }}
        >
          <Group>
            <ThemeIcon color="pink" variant="light">
              <HardDrives weight="bold" />
            </ThemeIcon>
            <Text size="sm">Servers</Text>
          </Group>
        </UnstyledButton>

        <UnstyledButton
          className={cx(classes.button, {
            [classes.active]: router.pathname == "/about",
          })}
          onClick={() => router.push("/about")}
          type="button"
          style={{ width: "100%" }}
        >
          <Group>
            <ThemeIcon color="teal" variant="light">
              <Database weight="bold" />
            </ThemeIcon>
            <Text size="sm">Databases</Text>
          </Group>
        </UnstyledButton>
      </Navbar.Section>
      <Navbar.Section>
        <UnstyledButton
          onClick={() => router.push("/account")}
          type="button"
          style={{ width: "100%" }}
        >
          <Group>
            <Avatar>?</Avatar>
            <Text size="sm">{username}</Text>
          </Group>
        </UnstyledButton>
      </Navbar.Section>
    </Navbar>
  );
}
