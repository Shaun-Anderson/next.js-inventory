import { ReactElement, forwardRef, useState } from "react";
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
  LoadingOverlay,
} from "@mantine/core";
import { ReactTable } from "../../components/table";
import { useModals } from "@mantine/modals";
import { useForm, useForceUpdate } from "@mantine/hooks";
import Link from "next/link";
import Header from "../../components/header";
import Breadcrumbs from "../../components/breadcrumb";
import { DatePicker } from "@mantine/dates";
import { supabase } from "../../utils/supabaseClient";

type Server = {
  id: number;
  name: string;
  assetNumber: string;
  location: string;
  datePurchased: Date;
  brand: string;
  model: string;
  serial: string;
  macAddress: string;
};

export default function About() {
  const [loading, setLoading] = useState(false);

  async function add(server: Server) {
    setLoading(true);
    const user = supabase.auth.user();
    await supabase.from("servers").insert({
      asset_number: server.assetNumber,
      name: server.name,
      // location: server.location,
      date_purchased: server.datePurchased,
      user_id: user?.id,
    });
    setLoading(false);
    console.log("Add");
  }
  const form = useForm<Server>({
    initialValues: {
      id: 0,
      name: "",
      assetNumber: "",
      location: "",
      datePurchased: new Date(),
      brand: "",
      model: "",
      serial: "",
      macAddress: "",
    },
    // validationRules: {
    //   assetNumber: (value) => /^\S+@\S+$/.test(value),
    // },
  });

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
            <LoadingOverlay visible={loading} />

            <form onSubmit={form.onSubmit((values) => add(values))}>
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
                    label="Name"
                    {...form.getInputProps("name")}
                  />
                </Col>
                <Col span={3}>
                  <TextInput
                    required
                    label="Location"
                    {...form.getInputProps("location")}
                  />
                </Col>
                <Col span={6}>
                  {" "}
                  <DatePicker
                    placeholder="Purchased date"
                    label="Purchased Date"
                    required
                    {...form.getInputProps("datePurchased")}
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
