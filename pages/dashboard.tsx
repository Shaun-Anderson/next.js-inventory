import type { ReactElement } from "react";
import Layout from "../components/layout";
import Sidebar from "../components/sidebar";
import { Button, Title } from "@mantine/core";
import { ReactTable } from "../components/table";

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

  return (
    <section>
      <Title order={1}>Dashboard</Title>

      <ReactTable<Server> data={data} columns={columns} />
    </section>
  );
}

About.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
