import { memo, ReactElement, useEffect, useState } from "react";
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
  Modal,
  Select,
  Space,
  LoadingOverlay,
} from "@mantine/core";
import { ReactTable } from "../../components/table";
import { useModals } from "@mantine/modals";
import { useForm, useForceUpdate } from "@mantine/hooks";
import useSWR from "swr";
import Link from "next/link";
import Header from "../../components/header";
import { Trash, Pencil, Plus, HardDrives, GitBranch } from "phosphor-react";
import { useRouter } from "next/router";
import Breadcrumbs from "../../components/breadcrumb";
import { supabase } from "../../utils/supabaseClient";
import { getServers } from "../api/server";
import { useModal } from "use-modal-hook";
import { ServerStyles } from "@mantine/next";

type Server = {
  id: number;
  name: string;
  asset_number: string;
  status: string;
  location_id: number;
  location: string;
  brand: string;
  model: string;
  serial: string;
  mac_address: string;
  ip_address: string;
  port: number;
};

const DeleteModal = memo(
  ({ isOpen, onClose, title, description, closeBtnLabel, data, onSubmit }) => {
    console.log(data);
    const form = useForm<Server>({
      initialValues: data,
    });
    const [loading, setLoading] = useState(false);
    async function submit(server: Server) {
      setLoading(true);
      const { data, error } = await supabase
        .from("servers")
        .delete()
        .match({ id: server.id });
      if (error) return setLoading(false);
      onSubmit(server);
      setLoading(false);
    }
    return (
      <Modal
        title={title}
        opened={isOpen}
        onClose={onClose}
        overlayOpacity={0.5}
        centered
      >
        <LoadingOverlay visible={loading} />
        <form onSubmit={form.onSubmit((values) => submit(values))}>
          <Group>
            <Text>{description}</Text>
          </Group>

          <Button
            type="submit"
            fullWidth
            variant="light"
            color="red"
            sx={{ marginTop: 10 }}
          >
            Submit
          </Button>
        </form>
      </Modal>
    );
  }
);

interface ModalProps<T> {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose?: () => void;
  onSubmit?: (data: T) => void;
  data: T;
}

const StatusModal = memo(
  ({
    isOpen,
    onClose,
    title,
    description,
    data,
    onSubmit,
  }: ModalProps<Server>) => {
    console.log(data);
    const form = useForm<Server>({
      initialValues: data,
    });
    const [loading, setLoading] = useState(false);
    async function submit(server: Server) {
      setLoading(true);
      const { data, error } = await supabase
        .from("servers")
        .update({ status: server.status })
        .match({ id: server.id });
      console.log(data);
      if (error) return setLoading(false);
      if (onSubmit) onSubmit(server);
      setLoading(false);
    }
    return (
      <Modal
        title={title}
        opened={isOpen}
        onClose={onClose}
        overlayOpacity={0.5}
        centered
      >
        <LoadingOverlay visible={loading} />
        <form onSubmit={form.onSubmit((values) => submit(values))}>
          <Group>
            <Text
              size="sm"
              sx={(theme) => ({
                color: theme.colors.gray[5],
              })}
            >
              {description}
            </Text>
          </Group>
          <Group grow sx={{ marginTop: 10 }}>
            <Select
              required
              placeholder="Pick one"
              {...form.getInputProps("status")}
              data={[
                { value: "online", label: "Online" },
                { value: "offline", label: "Offline" },
                { value: "maintenance", label: "Maintenance" },
              ]}
            />
          </Group>
          <Space />
          <Button type="submit" fullWidth>
            Submit
          </Button>
        </form>
      </Modal>
    );
  }
);

export default function About() {
  const router = useRouter();
  const {
    data: servers,
    mutate,
    error,
  } = useSWR<Server[]>("api/server", getServers);

  const [showModal, hideModal] = useModal(DeleteModal, {
    title: "Delete Server",
    description: "Are you sure you want to delete this server?",
    closeBtnLabel: "Close",
    data: undefined,
    onSubmit: async (server: Server) => {
      await mutate(servers?.filter((x) => x.id != server.id));
      hideModal();
    },
  });

  const [showStatusModal, hideStatusModal] = useModal(StatusModal, {
    title: "Update Server Status",
    description: "Update Status",
    data: undefined,
    onSubmit: async (server: Server) => {
      await mutate(servers?.map((el) => (el.id === server.id ? server : el)));
      hideStatusModal();
    },
  });

  if (error) <p>Loading failed...</p>;
  if (!servers) <h1>Loading...</h1>;
  if (servers == undefined) <h1>Loading...</h1>;

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
        <ReactTable<Server>
          data={servers ?? []}
          searchable
          selectable
          // pagination
          loading={servers == undefined}
          columns={columns}
          onRowClick={(row: Server) => {
            router.push(`/servers/${row.id}`);
          }}
        />
      </Card>
    </section>
  );
}

About.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
