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
  ThemeIcon,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useForm, useForceUpdate } from "@mantine/hooks";
import Link from "next/link";
import Header from "../../components/header";
import { Trash, Pencil, Plus, Package, Article } from "phosphor-react";
import { ReactTable } from "../../components/table";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import useSWR from "swr";
import { getServer } from "../api/server";
import { useModal } from "use-modal-hook";
import ItemTable from "../../components/locations/itemTable";
import { getLocation } from "../api/location";

type Server = {
  id: number;
  name: string;
  assetNumber: string;
  location_id: number;
  datePurchased: Date;
  brand: string;
  model: string;
  serial: string;
  macAddress: string;
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

  const { data, error } = useSWR(id, getLocation);
  console.log(data, error);

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
      <Header title={data.name} showBreadcumbs />
      <Grid>
        <Col span={4}>
          <Card padding="sm">
            <Group position="apart" sx={{ marginBottom: 10 }}>
              <Group>
                <ThemeIcon color="gray" variant="light">
                  <Article weight="bold" />
                </ThemeIcon>
                <Text weight={500}>Details</Text>
              </Group>
              <Button
                type="button"
                size="xs"
                variant="light"
                color="yellow"
                onClick={showModal}
              >
                Edit
              </Button>
            </Group>
            <Grid>
              <Col span={12}>
                <Text size="sm" weight={500} color="gray">
                  Name
                </Text>
                <Text size="sm">{data.name}</Text>
              </Col>
            </Grid>
          </Card>
        </Col>
        <Col span={8}>
          <ItemTable />
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
