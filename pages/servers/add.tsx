import { ReactElement, forwardRef } from "react";
import Layout from "../../components/layout";
import Sidebar from "../../components/sidebar";
import {
  Button,
  Title,
  Grid,
  Col,
  TextInput,
  Text,
  Group,
  Select,
  Avatar,
  Loader,
  Card,
  Divider,
  Center,
} from "@mantine/core";
import { ReactTable } from "../../components/table";
import { useModals } from "@mantine/modals";
import { useForm, useForceUpdate } from "@mantine/hooks";
import Link from "next/link";
import Header from "../../components/header";
import Breadcrumbs from "../../components/breadcrumb";
import { DatePicker } from "@mantine/dates";

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

  const SelectItem = forwardRef(
    ({ image, label, description, ...others }, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <Avatar src={image} />

          <div>
            <Text>{label}</Text>
            <Text size="xs" color="dimmed">
              {description}
            </Text>
          </div>
        </Group>
      </div>
    )
  );

  return (
    <section>
      <Header
        title="Add Server"
        showBreadcumbs
        subTitle="Add a new server to the inventory"
        rightArea={
          <Link href="../../servers">
            <Button component="a" variant="light" color="gray">
              {" "}
              Cancel
            </Button>
          </Link>
        }
      />
      <Center>
        <div style={{ maxWidth: 800, width: "100%", position: "relative" }}>
          <Card>
            <form onSubmit={form.onSubmit((values) => add())}>
              <Grid>
                <Col span={3}>
                  <TextInput
                    required
                    label="Asset Number"
                    {...form.getInputProps("assetNumber")}
                  />
                </Col>
                <Col span={3}>
                  <TextInput
                    required
                    label="Location"
                    {...form.getInputProps("assetNumber")}
                  />
                </Col>
                <Col span={6}>
                  {" "}
                  <DatePicker
                    placeholder="Purchased date"
                    label="Purchased Date"
                    required
                  />
                </Col>
              </Grid>

              <Divider my="xs" label="Hardware details" />
              <Grid>
                <Col span={6}>
                  <Select
                    label="Brand"
                    required
                    placeholder="Pick a brand"
                    transition="pop-top-left"
                    transitionDuration={80}
                    transitionTimingFunction="ease"
                    rightSection={<Loader size="xs" />}
                    itemComponent={SelectItem}
                    data={[
                      {
                        image:
                          "https://img.icons8.com/clouds/256/000000/futurama-bender.png",
                        label: "Bender Bending Rodríguez",
                        value: "1",
                        description: "Fascinated with cooking",
                      },
                    ]}
                    searchable
                    maxDropdownHeight={400}
                    nothingFound="No data found"
                    filter={(value, item) =>
                      item.label
                        .toLowerCase()
                        .includes(value.toLowerCase().trim()) ||
                      item.description
                        .toLowerCase()
                        .includes(value.toLowerCase().trim())
                    }
                  />
                </Col>
                <Col span={6}>
                  <Select
                    label="Modal"
                    placeholder="Pick a model"
                    itemComponent={SelectItem}
                    data={[
                      {
                        image:
                          "https://img.icons8.com/clouds/256/000000/futurama-bender.png",
                        label: "Bender Bending Rodríguez",
                        value: "1",
                        description: "Fascinated with cooking",
                      },
                    ]}
                    searchable
                    maxDropdownHeight={400}
                    nothingFound="No data found"
                    filter={(value, item) =>
                      item.label
                        .toLowerCase()
                        .includes(value.toLowerCase().trim()) ||
                      item.description
                        .toLowerCase()
                        .includes(value.toLowerCase().trim())
                    }
                  />
                </Col>
                <Col span={4}>
                  <TextInput label="Serial Number" />
                </Col>
                <Col span={4}>
                  <TextInput label="Mac Address" />
                </Col>
              </Grid>

              <Divider my="xs" label="Network details" />
              <Group>
                <TextInput label="IP Address" />
                <TextInput label="Port" sx={{ width: "80px" }} />
              </Group>
              <Divider my="xs" variant="dashed" />
              <Button type="submit">Submit</Button>
            </form>
          </Card>
        </div>
      </Center>
    </section>
  );
}

About.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
