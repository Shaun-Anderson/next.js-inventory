import { ReactElement, useEffect, useState } from "react";
import Layout from "../components/layout";
import {
  Button,
  ActionIcon,
  Grid,
  Text,
  TextInput,
  Group,
  ThemeIcon,
  Card,
  Menu,
  Divider,
  Badge,
} from "@mantine/core";
import { ReactTable } from "../components/table";
import { useModals } from "@mantine/modals";
import { useForm, useForceUpdate } from "@mantine/hooks";
import useSWR from "swr";
import Link from "next/link";
import Header from "../components/header";
import {
  Trash,
  Pencil,
  Plus,
  HardDrives,
  GitBranch,
  Database,
} from "phosphor-react";
import { useRouter } from "next/router";
import Breadcrumbs from "../components/breadcrumb";
import { supabase } from "../utils/supabaseClient";
import { getServers } from "./api/server";

type Server = {
  id: number;
  name: string;
  asset_number: string;
  status: string;
  location: string;
  brand: string;
  model: string;
  serial: string;
  mac_address: string;
  ip_address: string;
  port: number;
};

export default function About() {
  const router = useRouter();
  const { data: servers, error } = useSWR("api/server", getServers);
  if (error) <p>Loading failed...</p>;
  if (!servers) <h1>Loading...</h1>;
  if (servers == undefined) <h1>Loading...</h1>;
  console.log(servers);
  const columns = [
    {
      Header: "Server",
      id: "server",
      accessor: "name",
      minWidth: 200,
      Cell: (data: any) => (
        <Group spacing="5px" direction="column">
          <Text size="sm" weight={500}>
            {data.row.original.name ?? ""}
          </Text>
          <Text size="xs" color="gray">
            {data.row.original.asset_number}
          </Text>
        </Group>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      minWidth: 100,
      Cell: (data: any) => {
        switch (data.row.original.status) {
          case "online":
            return (
              <Badge size="sm" color="green">
                {data.row.original.status}
              </Badge>
            );
          case "offline":
            return (
              <Badge size="sm" color="gray">
                {data.row.original.status}
              </Badge>
            );
          case "maintenance":
            return (
              <Badge size="sm" color="yellow">
                {data.row.original.status}
              </Badge>
            );
        }
      },
    },
    {
      Header: "Brand",
      accessor: "brand",
    },
    {
      Header: "Model",
      accessor: "model",
    },

    {
      Header: "Location",
      accessor: "location.name",
      minWidth: 200,
    },
    // {
    //   Header: "Network",
    //   id: "networkLocation",
    //   Cell: (data: any) => (
    //     <Group spacing="5px" direction="column">
    //       <Text size="sm">IP: {data.row.original.ipAddress}</Text>
    //       <Text size="xs" color="gray">
    //         port: {data.row.original.port}
    //       </Text>
    //     </Group>
    //   ),
    // },
    {
      Header: "",
      id: "col13",
      minWidth: 120,
      maxWidth: 120,
      Cell: (data: any) => (
        <Group spacing="5px">
          <Menu
            onClick={(e: any) => {
              e.stopPropagation();
            }}
          >
            <Menu.Label>Actions</Menu.Label>
            <Menu.Item
              icon={<GitBranch />}
              onClick={() => showStatusModal({ data: data.row.original })}
            >
              Change Status
            </Menu.Item>
            <Menu.Item icon={<GitBranch />}>Move Locations</Menu.Item>
            <Divider />
            <Menu.Item
              color="red"
              icon={<Trash />}
              onClick={() => showModal({ data: data.row.original })}
            >
              Delete
            </Menu.Item>
          </Menu>
          <ActionIcon
            color="yellow"
            variant="light"
            onClick={(e: any) => {
              e.stopPropagation();
            }}
          >
            <Pencil />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="light"
            onClick={(e: any) => {
              e.stopPropagation();
              showModal({ data: data.row.original });
            }}
          >
            <Trash />
          </ActionIcon>
        </Group>
      ),
    },
  ];
  return (
    <section
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Header
        icon={
          <ThemeIcon size="lg" color="teal" variant="light">
            <Database weight="bold" />
          </ThemeIcon>
        }
        title="Databases"
        subTitle="On-site databases"
        rightArea={
          <Link href="servers/add">
            <Button
              component="a"
              variant="light"
              color="cyan"
              leftIcon={<Plus weight="bold" />}
            >
              Add Server
            </Button>
          </Link>
        }
      />
      <Card sx={{ display: "block" }}>
        <div style={{ height: "100%" }}></div>
      </Card>
    </section>
  );
}

About.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
