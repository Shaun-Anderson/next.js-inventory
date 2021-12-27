import { Title, Text, Grid, Col, Group, ThemeIcon } from "@mantine/core";
import { Laptop, HardDrives, Database } from "phosphor-react";
import Breadcrumbs from "./breadcrumb";

interface HeaderProps {
  icon?: React.ReactNode;
  title: string;
  subTitle?: string;
  rightArea?: React.ReactNode;
  showBreadcumbs: boolean;
}
export default function Header({
  icon,
  title,
  rightArea,
  showBreadcumbs,
  subTitle,
}: HeaderProps) {
  return (
    <Grid sx={{ marginBottom: 10 }}>
      <Col span={6}>
        <Group>
          {icon && icon}
          <div>
            {showBreadcumbs && <Breadcrumbs />}
            <Title order={2}>{title}</Title>
            <Text size="xs" color="gray">
              {subTitle}
            </Text>
          </div>
        </Group>
      </Col>
      <Col
        span={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {rightArea && rightArea}
      </Col>
    </Grid>
  );
}
