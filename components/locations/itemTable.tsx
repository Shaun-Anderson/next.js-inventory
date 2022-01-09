import { memo, ReactElement, useState } from "react";
import Layout from "../../components/layout";
import {
  Button,
  ActionIcon,
  Card,
  Badge,
  Text,
  Group,
  useMantineTheme,
  Grid,
  Col,
  Progress,
  Loader,
  TextInput,
  NumberInput,
  Select,
  Space,
  Modal,
  Divider,
  Menu,
  ThemeIcon,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useForm, useForceUpdate } from "@mantine/hooks";
import Link from "next/link";
import Header from "../../components/header";
import { MapPin, Package } from "phosphor-react";
import { ReactTable } from "../../components/table";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import useSWR from "swr";
import { useModal } from "use-modal-hook";
import { getServerForLocation } from "../../pages/api/server";
import { Server } from "../../types/Server";

export default function ItemTable() {
  const router = useRouter();
  const modals = useModals();
  const theme = useMantineTheme();
  const { id } = router.query;
  // if (!id) {
  //   return <Loader />;
  // }

  const MyModal = memo(
    ({ isOpen, onClose, title, description, closeBtnLabel }) => {
      const form = useForm<Storage>({
        initialValues: {
          id: 0,
          brand: "",
          model: "",
          capacity: 0,
          capacityClassification: "",
          driveClassification: "",
          driveName: "",
        },
        validationRules: {
          brand: (value) => value.trim().length >= 1,
          capacityClassification: (value) => value.trim().length >= 1,
          capacity: (value) => value != 0,
        },
      });
      return (
        <Modal
          title={title}
          opened={isOpen}
          onClose={onClose}
          overlayOpacity={0.5}
          centered
        >
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <Group grow>
              <TextInput label="Drive" />

              <TextInput
                label="Capacity"
                type="number"
                required
                {...form.getInputProps("capacity")}
                rightSectionWidth={100}
                rightSection={
                  <Select
                    required
                    placeholder="Pick one"
                    {...form.getInputProps("capacityClassification")}
                    data={[
                      { value: "mb", label: "MB" },
                      { value: "gb", label: "GB" },
                      { value: "tb", label: "TB" },
                    ]}
                  />
                }
              />
            </Group>
            <Group grow>
              <TextInput label="Brand" {...form.getInputProps("brand")} />
              <TextInput label="Model" />
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
  const [showModal, hideModal] = useModal(MyModal, {
    title: "Add Storage",
    description: "I Like React Hooks",
    closeBtnLabel: "Close",
  });

  const { data, error } = useSWR(
    [`api/location/${id}`, id],
    getServerForLocation
  );
  //if (error) return <p>Loading failed...</p>;
  //if (!data) return <Loader />;

  return (
    <Card sx={{ padding: 0 }}>
      <Group position="apart" style={{ margin: 10 }}>
        <Group>
          <ThemeIcon color="indigo" variant="light">
            <Package weight="bold" />
          </ThemeIcon>
          <Text weight={500}>Items</Text>
        </Group>
        <Button type="button" size="xs" variant="light" onClick={showModal}>
          Add
        </Button>
      </Group>
      <ReactTable
        data={data ?? []}
        loading={data == undefined}
        columns={[
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
        ]}
      />
    </Card>
  );
}
