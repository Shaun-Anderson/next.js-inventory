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
import { AsyncSelect } from "../../components/asyncSelect";
import { useRouter } from "next/router";

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
type Location = {
  id: number;
  name: string;
};
export default function About() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function add(server: Server) {
    setLoading(true);
    const user = supabase.auth.user();

    console.log(form);
    const { data, error } = await supabase.from("servers").insert({
      asset_number: server.assetNumber,
      name: server.name,
      location_id: server.location_id,
      date_purchased: server.datePurchased,
      user_id: user?.id,
    });

    console.log(data);

    if (error) return setLoading(false);

    router.push(`/servers/${data[0].id}`);

    setLoading(false);
    console.log("Add");
  }
  const form = useForm<Server>({
    initialValues: {
      id: 0,
      name: "",
      assetNumber: "",
      location_id: 0,
      datePurchased: new Date(),
      brand: "",
      model: "",
      serial: "",
      macAddress: "",
    },
    validationRules: {
      name: (value) => value.trim().length >= 1,
      assetNumber: (value) => value.trim().length >= 1,
      location_id: (value) => value != 0,
      //assetNumber: (value) => /^\S+@\S+$/.test(value),
    },
    errorMessages: {
      name: "Name is required",
      assetNumber: "Asset Number is required",
      location_id: "Location is required",
    },
  });

  console.log(form);

  const SelectItem = forwardRef(
    ({ name, label, description, ...others }, ref) => (
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
                    label="Name"
                    {...form.getInputProps("name")}
                  />
                </Col>
                <Col span={3}>
                  <TextInput
                    required
                    label="Asset Number"
                    {...form.getInputProps("assetNumber")}
                  />
                </Col>
                <Col span={6}>
                  <AsyncSelect<Location>
                    url="locations"
                    label="Location"
                    labelProp="name"
                    valueProp="id"
                    required
                    placeholder="Pick a location"
                    {...form.getInputProps("location_id")}
                    rightSection={<Loader size="xs" />}
                    itemComponent={forwardRef(
                      ({ name, ...others }: Location, ref) => (
                        <div ref={ref} {...others}>
                          <Group noWrap>
                            <div>
                              <Text>{name}</Text>
                            </div>
                          </Group>
                        </div>
                      )
                    )}
                    searchable
                    maxDropdownHeight={400}
                    filter={(value, item) =>
                      item.name
                        .toLowerCase()
                        .includes(value.toLowerCase().trim())
                    }
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
                  <AsyncSelect<Location>
                    url="locations"
                    label="Brand"
                    labelProp="name"
                    valueProp="id"
                    required
                    placeholder="Pick a brand"
                    rightSection={<Loader size="xs" />}
                    itemComponent={forwardRef(
                      ({ name, ...others }: Location, ref) => (
                        <div ref={ref} {...others}>
                          <Group noWrap>
                            <div>
                              <Text>{name}</Text>
                            </div>
                          </Group>
                        </div>
                      )
                    )}
                    searchable
                    maxDropdownHeight={400}
                    filter={(value, item) =>
                      item.name
                        .toLowerCase()
                        .includes(value.toLowerCase().trim())
                    }
                  />
                </Col>
                <Col span={6}>
                  <AsyncSelect<Location>
                    url="locations"
                    label="Location"
                    labelProp="name"
                    valueProp="id"
                    required
                    placeholder="Pick a location"
                    rightSection={<Loader size="xs" />}
                    itemComponent={forwardRef(
                      ({ name, ...others }: Location, ref) => (
                        <div ref={ref} {...others}>
                          <Group noWrap>
                            <div>
                              <Text>{name}</Text>
                            </div>
                          </Group>
                        </div>
                      )
                    )}
                    searchable
                    maxDropdownHeight={400}
                    filter={(value, item) =>
                      item.name
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
