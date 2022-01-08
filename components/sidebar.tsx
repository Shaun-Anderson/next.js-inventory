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
  Divider,
  useMantineColorScheme,
  ActionIcon,
  Space,
} from "@mantine/core";
import {
  Laptop,
  HardDrives,
  Database,
  House,
  CaretRight,
  Package,
  Moon,
  Sun,
  MapPin,
} from "phosphor-react";
import { useRouter } from "next/router";
import { createStyles } from "@mantine/core";
import { supabase } from "../utils/supabaseClient";
import { useEffect, useState } from "react";
import { NavbarSection } from "@mantine/core/lib/components/AppShell/Navbar/NavbarSection/NavbarSection";

const useStyles = createStyles((theme) => ({
  button: {
    // color: theme.white,
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

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      // console.log(user);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }
      // console.log(data);

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
      <Navbar.Section style={{ padding: "10px" }}>
        <Group spacing="5px" sx={{ display: "flex" }}>
          <ThemeIcon size="lg" variant="light">
            <Package size={24} weight="bold" />
          </ThemeIcon>
          <Title order={2} sx={{ padding: 10, flexGrow: 1 }}>
            Inventory
          </Title>
          <Space />
          <ActionIcon onClick={() => toggleColorScheme()}>
            {colorScheme == "light" ? <Sun /> : <Moon />}
          </ActionIcon>
        </Group>
      </Navbar.Section>
      <Navbar.Section grow mt="lg">
        <UnstyledButton
          className={cx(classes.button, {
            [classes.active]: router.pathname == "/dashboard",
          })}
          onClick={() => router.push("/dashboard")}
          type="button"
          style={{ width: "100%" }}
        >
          <Group>
            <ThemeIcon variant="light">
              <House weight="bold" />
            </ThemeIcon>
            <Text size="sm">Dashboard</Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          className={cx(classes.button, {
            [classes.active]: router.pathname == "/systems",
          })}
          onClick={() => router.push("/systems")}
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
            [classes.active]: router.pathname == "/databases",
          })}
          onClick={() => router.push("/databases")}
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

        <UnstyledButton
          className={cx(classes.button, {
            [classes.active]: router.pathname == "/locations",
          })}
          onClick={() => router.push("/locations")}
          type="button"
          style={{ width: "100%" }}
        >
          <Group>
            <ThemeIcon color="indigo" variant="light">
              <MapPin weight="bold" />
            </ThemeIcon>
            <Text size="sm">Locations</Text>
          </Group>
        </UnstyledButton>
      </Navbar.Section>
      <Navbar.Section>
        <Divider my={5} />
        <UnstyledButton
          onClick={() => router.push("/account")}
          className={classes.button}
          type="button"
          style={{ width: "100%" }}
        >
          <Group>
            <Avatar radius="xl">?</Avatar>
            <Group direction="column" style={{ flex: "1 1 0%" }}>
              <Text size="sm">{username}</Text>
            </Group>
            <CaretRight />
          </Group>
        </UnstyledButton>
      </Navbar.Section>
    </Navbar>
  );
}
