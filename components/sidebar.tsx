import Link from "next/link";
import styles from "./layout.module.css";
import { Navbar } from "@mantine/core";
import { UnstyledButton, Group, ThemeIcon, Text, Title } from "@mantine/core";
import { Laptop, HardDrives, Database } from "phosphor-react";
import { useRouter } from "next/router";
import { createStyles } from "@mantine/core";

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

export default function Sidebar() {
  const router = useRouter();
  const { classes, cx } = useStyles();

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
    </Navbar>
  );
}
