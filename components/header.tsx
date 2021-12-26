import { Title, Text, Grid, Col } from "@mantine/core";

interface HeaderProps {
  title: string;
  subTitle?: string;
  rightArea?: React.ReactNode;
}
export default function Header({ title, rightArea, subTitle }: HeaderProps) {
  return (
    <Grid sx={{ marginBottom: 10 }}>
      <Col span={6}>
        <Title order={2}>{title}</Title>
        <Text size="xs" color="gray">
          {subTitle}
        </Text>
      </Col>
      <Col span={6} sx={{ textAlign: "right" }}>
        {rightArea && rightArea}
      </Col>
    </Grid>
  );
}
