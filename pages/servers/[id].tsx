import type { ReactElement } from "react";
import Layout from "../../components/layout";
import { Button, ActionIcon, Card, Col, TextInput, Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useForm, useForceUpdate } from "@mantine/hooks";
import Link from "next/link";
import Header from "../../components/header";
import { Trash, Pencil, Plus } from "phosphor-react";

type Server = {
  id: number;
  assetNumber: string;
  brand: string;
  model: string;
  serial: string;
  macAddress: string;
};

export default function About() {
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
          <ActionIcon color="yellow" variant="light">
            <Pencil />
          </ActionIcon>
          <ActionIcon color="red" variant="light">
            <Trash />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  const data: Server = {
    id: 1,
    assetNumber: "Test #1",
    brand: "Microsoft",
    model: "Test Model",
    serial: "00000001",
    macAddress: "1234",
  };

  return (
    <section>
      <Header
        title={data.assetNumber}
        subTitle={data.serial}
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
      <Card></Card>
    </section>
  );
}

About.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
