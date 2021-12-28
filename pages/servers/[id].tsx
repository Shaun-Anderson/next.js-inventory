import { ReactElement, useState } from "react";
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
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useForm, useForceUpdate } from "@mantine/hooks";
import Link from "next/link";
import Header from "../../components/header";
import { Trash, Pencil, Plus } from "phosphor-react";
import { ReactTable } from "../../components/table";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import useSWR from "swr";
import { getServer } from "../api/server";

type Server = {
  id: number;
  assetNumber: string;
  status: string;
  location: string;
  brand: string;
  model: string;
  serial: string;
  macAddress: string;
  storage?: Storage[];
};

type Storage = {
  id: number;
  driveClassification: string;
  driveName?: string;
  brand: string;
  model: string;
  capacity: number;
  capacityClassification: string;
};

export default function About() {
  const router = useRouter();
  const theme = useMantineTheme();
  const { id } = router.query;
  // if (!id) {
  //   return <Loader />;
  // }
  console.log(`ID: ${id}`);
  const { data, error } = useSWR(id, getServer);
  console.log(data, error);
  const [storageData, setStorageData] = useState<Storage[]>([
    {
      id: 1,
      driveClassification: "D",
      driveName: "Shared",
      brand: "Kensinton",
      model: "1",
      capacity: 100,
      capacityClassification: "GB",
    },
  ]);

  if (error) return <p>Loading failed...</p>;
  if (!data) return <Loader />;

  const columns = [
    {
      Header: "Drive",
      accessor: "driveClassification",
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
      Header: "Capacity",
      id: "col13",
      maxWidth: 50,
      minWidth: 50,
      width: 50,
      Cell: (data: any) => (
        <Group spacing="5px">
          <Text size="sm">{data.row.original.capacity}</Text>
          <Text size="xs" color="gray">
            {data.row.original.capacityClassification}
          </Text>
        </Group>
      ),
    },
  ];

  return (
    <section>
      <Header
        title={data.asset_number}
        showBreadcumbs
        // subTitle={data.serial}
        rightArea={
          <Link href="servers/add">
            <Button
              component="a"
              variant="light"
              color="yellow"
              leftIcon={<Plus weight="bold" />}
            >
              Edit Server
            </Button>
          </Link>
        }
      />
      <Grid>
        <Col span={7}>
          <Card sx={{ marginBottom: 10 }}>
            <Group
              position="apart"
              style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
            >
              <Text weight="bold">Details</Text>
              <Badge color="pink" variant="light">
                Edit
              </Badge>
            </Group>
            <Grid>
              <Col span={3}>
                <Text size="sm" weight={500} color="gray">
                  Asset Number
                </Text>
                <Text size="sm">{data.asset_number}</Text>
              </Col>
              <Col span={3}>
                <Text size="sm" weight={500}>
                  Location
                </Text>
                <Text size="sm">{data.location}</Text>
              </Col>
              <Col span={3}>
                <Text size="sm" weight={500}>
                  Status
                </Text>
                <Badge size="sm" color="green">
                  {data.status}
                </Badge>
              </Col>
            </Grid>
          </Card>
          <Card>
            <Group
              position="apart"
              style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
            >
              <Text weight={500}>Storage</Text>
              <Button type="button" size="xs" variant="light">
                Add
              </Button>
            </Group>
            <Progress
              size="xl"
              sections={[
                { value: 40, color: "cyan" },
                { value: 15, color: "orange" },
                { value: 15, color: "grape" },
              ]}
            />
            <ReactTable data={storageData} columns={columns} />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Group
              position="apart"
              style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
            >
              <Text weight={500}>Notes</Text>
              <Button type="button" variant="light">
                Add
              </Button>
            </Group>
            <Card.Section>Test</Card.Section>
          </Card>
        </Col>
      </Grid>
    </section>
  );
}

About.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// export async function getServerSideProps({ req }) {
//   const { user } = await supabase.auth.api.getUserByCookie(req);
//   console.log("ServerSide user:" + user?.id);
//   if (!user) {
//     console.log("redirect");
//     // If no user, redirect to index.
//     return { props: {}, redirect: { destination: "/", permanent: false } };
//   }

//   // If there is a user, return it.
//   return { props: { user } };
// }
