import { memo, ReactElement, useState } from "react";
import Layout from "../../components/layout";
import {
  Button,
  Text,
  Group,
  ThemeIcon,
  Card,
  Modal,
  Select,
  Space,
  LoadingOverlay,
  TextInput,
} from "@mantine/core";
import { ReactTable } from "../../components/table";
import { useForm } from "@mantine/hooks";
import useSWR from "swr";
import Header from "../../components/header";
import { Plus, MapPin } from "phosphor-react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import { useModal } from "use-modal-hook";
import { getLocations } from "../api/location";
import { ModalProps } from "../../types/ModalProps";

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

const AddModal = memo(
  ({
    isOpen,
    onClose,
    title,
    description,
    data,
    onSubmit,
  }: ModalProps<Location>) => {
    const form = useForm<Location>({
      initialValues: {
        id: 0,
        name: "",
        user_id: "",
      },
      validationRules: {
        name: (value) => value.trim().length >= 1,
      },
      errorMessages: {
        name: "Name is required",
      },
    });
    const [loading, setLoading] = useState(false);
    async function submit(item: Location) {
      setLoading(true);
      const user = supabase.auth.user();
      const { data, error } = await supabase.from("locations").insert({
        name: item.name,
        user_id: user?.id,
      });
      console.log(data);
      if (error) return setLoading(false);
      if (onSubmit) onSubmit(item);
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
            <TextInput required label="Name" {...form.getInputProps("name")} />
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

  const [showAddModal, hideAddModal] = useModal(AddModal, {
    title: "Add Location",
    description: "Add a new location",
    data: undefined,
    onSubmit: async (item: Location) => {
      await mutate([...(locations ?? []), item]);
      hideAddModal();
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
          <Button
            component="a"
            variant="light"
            color="blue"
            leftIcon={<Plus weight="bold" />}
            onClick={() => showAddModal()}
          >
            Add Location
          </Button>
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
