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
import { Trash, Pencil, Plus, HardDrives, MapPin } from "phosphor-react";
import { useRouter } from "next/router";
import Breadcrumbs from "../../components/breadcrumb";
import { supabase } from "../../utils/supabaseClient";
import { getServers } from "../api/server";
import { useModal } from "use-modal-hook";
import { ServerStyles } from "@mantine/next";
import { getLocations } from "../api/location";

type Location = {
  id: number;
  name: string;
  user_id: string;
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
    data: locations,
    mutate,
    error,
  } = useSWR<Location[]>("api/location", getLocations);

  const [showModal, hideModal] = useModal(DeleteModal, {
    title: "Delete Location",
    description: "Are you sure you want to delete this server?",
    closeBtnLabel: "Close",
    data: undefined,
    onSubmit: async (item: Location) => {
      await mutate(locations?.filter((x) => x.id != item.id));
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
  if (!locations) <h1>Loading...</h1>;
  if (locations == undefined) <h1>Loading...</h1>;

  return (
    <section
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Header
        icon={
          <ThemeIcon size="lg" color="indigo" variant="light">
            <MapPin weight="bold" />
          </ThemeIcon>
        }
        title="Locations"
        subTitle="On-site locations"
        rightArea={
          <Link href="locations/add">
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
        <ReactTable<Location>
          data={locations ?? []}
          searchable
          selectable
          // pagination
          loading={locations == undefined}
          columns={[
            {
              Header: "Name",
              accessor: "name",
            },
          ]}
          onRowClick={(row: Location) => {
            router.push(`/locations/${row.id}`);
          }}
        />
      </Card>
    </section>
  );
}

About.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
