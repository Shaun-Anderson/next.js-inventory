import type { ReactElement } from "react";
import Layout from "../../components/layout";
import {
  Button,
  ActionIcon,
  Grid,
  Col,
  TextInput,
  Group,
  ThemeIcon,
} from "@mantine/core";
import { ReactTable } from "../../components/table";
import { useModals } from "@mantine/modals";
import { useForm, useForceUpdate } from "@mantine/hooks";
import Link from "next/link";
import Header from "../../components/header";
import { Trash, Pencil, Plus, HardDrives } from "phosphor-react";
import { useRouter } from "next/router";
import Breadcrumbs from "../../components/breadcrumb";

type Server = {
  id: number;
  assetNumber: string;
  brand: string;
  model: string;
  serial: string;
  macAddress: string;
};

export default function About() {
  const router = useRouter();

  const columns = [
    {
      Header: "Id",
      accessor: "id",
    },
    {
      Header: "Asset Number",
      accessor: "assetNumber",
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
      Header: "",
      id: "col13",
      maxWidth: 50,
      minWidth: 50,
      width: 50,
      Cell: () => (
        <Group spacing="5px">
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

  const data: Server[] = [
    {
      id: 1,
      assetNumber: "Test #1",
      brand: "Microsoft",
      model: "Test Model",
      serial: "00000001",
      macAddress: "1234",
    },
    {
      id: 2,
      assetNumber: "Test #2",
      brand: "Lenovo",
      model: "Test Model",
      serial: "00000001",
      macAddress: "1234",
    },
    {
      id: 3,
      assetNumber: "Test #3",
      brand: "Microsoft",
      model: "Test Model",
      serial: "00000001",
      macAddress: "1234",
    },
  ];

  const modals = useModals();
  const add = () => {
    console.log("Add");
  };
  const form = useForm<Server>({
    initialValues: {
      id: 0,
      assetNumber: "",
      brand: "",
      model: "",
      serial: "",
      macAddress: "",
    },
    validationRules: {
      assetNumber: (value) => /^\S+@\S+$/.test(value),
    },
  });
  const forceUpdate = useForceUpdate();

  const openAddModal = () => {
    const add = () => {
      console.log("Add");
      modals.closeModal(id);
    };

    const id = modals.openModal({
      title: "Add Server",
      children: (
        <form onSubmit={form.onSubmit((values) => add())}>
          <TextInput
            required
            label="Asset Number"
            onChange={() => {
              form.getInputProps("assetNumber").onChange();
              forceUpdate();
            }}
            error={form.getInputProps("assetNumber").error}
          />
          <TextInput required label="Asset Number" />
          <Button type="submit">Submit</Button>
        </form>
      ),
    });
  };

  return (
    <section>
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
      <ReactTable<Server>
        data={data}
        columns={columns}
        onRowClick={(row: Server) => {
          console.log(row);
          router.push(`/servers/${row.id}`);
        }}
      />
    </section>
  );
}

About.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
