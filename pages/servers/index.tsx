import { ReactElement, useState } from "react";
import Layout from "../../components/layout";
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
import { ReactTable } from "../../components/table";
import { useModals } from "@mantine/modals";
import { useForm, useForceUpdate } from "@mantine/hooks";
import Link from "next/link";
import Header from "../../components/header";
import { Trash, Pencil, Plus, HardDrives, GitBranch } from "phosphor-react";
import { useRouter } from "next/router";
import Breadcrumbs from "../../components/breadcrumb";

type Server = {
  id: number;
  name: string;
  assetNumber: string;
  status: string;
  location: string;
  brand: string;
  model: string;
  serial: string;
  macAddress: string;
  ipAddress: string;
  port: number;
};

export default function About() {
  const router = useRouter();

  const columns = [
    {
      Header: "Server",
      accessor: "name",
      Cell: (data: any) => (
        <Group spacing="5px" direction="column">
          <Text size="sm" weight={500}>
            {data.row.original.name}
          </Text>
          <Text size="xs" color="gray">
            {data.row.original.assetNumber}
          </Text>
        </Group>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: (data: any) => {
        switch (data.row.original.status) {
          case "online":
            return (
              <Badge size="sm" color="green">
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
      Header: "Network",
      id: "networkLocation",
      Cell: (data: any) => (
        <Group spacing="5px" direction="column">
          <Text size="sm">IP: {data.row.original.ipAddress}</Text>
          <Text size="xs" color="gray">
            port: {data.row.original.port}
          </Text>
        </Group>
      ),
    },
    {
      Header: "",
      id: "col13",
      maxWidth: 100,
      minWidth: 100,
      width: 100,
      Cell: () => (
        <Group spacing="5px">
          <Menu
            onClick={(e: any) => {
              e.stopPropagation();
            }}
          >
            <Menu.Label>Actions</Menu.Label>
            <Menu.Item icon={<GitBranch />}>Change Status</Menu.Item>
            <Menu.Item icon={<GitBranch />}>Move Locations</Menu.Item>
            <Divider />
            <Menu.Item color="red" icon={<Trash />}>
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
            onClick={(e: any) => e.stopPropagation()}
          >
            <Trash />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  const [data, setData] = useState<Server[]>([
    {
      id: 1,
      assetNumber: "Test #1",
      name: "Hades",
      status: "online",
      brand: "Microsoft",
      model: "Test Model",
      serial: "00000001",
      macAddress: "1234",
      ipAddress: "192.100.1.202",
      port: 4000,
      location: "Building B",
    },
    {
      id: 2,
      assetNumber: "Test #2",
      name: "Zues",
      status: "online",
      brand: "Lenovo",
      model: "Test Model",
      serial: "00000001",
      macAddress: "1234",
      ipAddress: "192.100.1.202",
      port: 4000,
      location: "Building B",
    },
    {
      id: 3,
      assetNumber: "Test #3",
      name: "Posiden",
      status: "online",
      brand: "Microsoft",
      model: "Test Model",
      serial: "00000001",
      macAddress: "1234",
      ipAddress: "192.100.1.202",
      port: 4000,
      location: "Building B",
    },
    {
      id: 3,
      assetNumber: "Test #3",
      name: "Hades",

      status: "online",
      brand: "Microsoft",
      model: "Test Model",
      serial: "00000001",
      macAddress: "1234",
      ipAddress: "192.100.1.202",
      port: 4000,
      location: "Building B",
    },
    {
      id: 3,
      assetNumber: "Test #3",
      brand: "Microsoft",
      status: "online",
      name: "Hades",

      model: "Test Model",
      serial: "00000001",
      macAddress: "1234",
      ipAddress: "192.100.1.202",
      port: 4000,
      location: "Building B",
    },
    {
      id: 3,
      assetNumber: "Test #3",
      status: "online",
      name: "Hades",

      brand: "Microsoft",
      model: "Test Model",
      serial: "00000001",
      macAddress: "1234",
      ipAddress: "192.100.1.202",
      port: 4000,
      location: "Building B",
    },
    {
      id: 3,
      assetNumber: "Test #3",
      status: "online",
      name: "Hades",

      brand: "Microsoft",
      model: "Test Model",
      serial: "00000001",
      macAddress: "1234",
      ipAddress: "192.100.1.202",
      port: 4000,
      location: "Building B",
    },
    {
      id: 3,
      assetNumber: "Test #3",
      status: "online",
      name: "Hades",

      brand: "Microsoft",
      model: "Test Model",
      serial: "00000001",
      macAddress: "1234",
      ipAddress: "192.100.1.202",
      port: 4000,
      location: "Building B",
    },
    {
      id: 3,
      assetNumber: "Test #3",
      brand: "Microsoft",
      status: "online",
      name: "Hades",

      model: "Test Model",
      serial: "00000001",
      macAddress: "1234",
      ipAddress: "192.100.1.202",
      port: 4000,
      location: "Building B",
    },
    {
      id: 3,
      assetNumber: "Test #3",
      brand: "Microsoft",
      status: "online",
      name: "Hades",

      model: "Test Model",
      serial: "00000001",
      macAddress: "1234",
      ipAddress: "192.100.1.202",
      port: 4000,
      location: "Building B",
    },
    {
      id: 3,
      assetNumber: "Test #3",
      brand: "Microsoft",
      model: "Test Model",
      status: "online",
      name: "Hades",

      serial: "00000001",
      macAddress: "1234",
      ipAddress: "192.100.1.202",
      port: 4000,
      location: "Building B",
    },
  ]);

  const add = (newServer: Server) => {
    setData([...data, newServer]);
  };

  return (
    <section
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Header
        icon={
          <ThemeIcon size="lg" color="pink" variant="light">
            <HardDrives weight="bold" />
          </ThemeIcon>
        }
        title="Servers"
        subTitle="On-site servers"
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
      <Card sx={{ display: "block", overflowY: "auto" }}>
        {/* <div style={{ overflow: "hidden" }}> */}
        <ReactTable<Server>
          data={data}
          searchable
          selectable
          pagination
          columns={columns}
          onRowClick={(row: Server) => {
            console.log(row);
            router.push(`/servers/${row.id}`);
          }}
        />
        {/* </div> */}
      </Card>
    </section>
  );
}

About.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
