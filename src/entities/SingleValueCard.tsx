import { Group, Paper, Text, ThemeIcon, createStyles } from "@mantine/core";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconQuestionMark,
} from "@tabler/icons-react";
import React from "react";
import { LabeledValue } from ".";

interface Props {
  title: string;
  value: React.ReactNode;
  diff?: number;
}

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
  },
}));

export const SingleValueCard: React.FC<Props> = ({ diff, title, value }) => {
  const { classes } = useStyles();
  return (
    <Paper withBorder p="md" radius="md" key={title} className={classes.card}>
      <Group position="apart">
        <LabeledValue label={title} value={value} />
        {renderDiffIcon()}
      </Group>
      {renderPercentChange()}
    </Paper>
  );

  function renderDiffIcon() {
    if (!diff) {
      return null;
    }
    const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight;
    return (
      <ThemeIcon
        color="gray"
        variant="light"
        sx={(theme) => ({
          color: diff > 0 ? theme.colors.teal[6] : theme.colors.red[6],
        })}
        size={38}
        radius="md"
      >
        <DiffIcon size="1.8rem" stroke={1.5} />
      </ThemeIcon>
    );
  }

  function renderPercentChange() {
    if (!diff) {
      return null;
    }
    const sign = diff > 0 ? "+" : diff < 0 ? "-" : "";
    return (
      <Text c="dimmed" fz="sm" mt="md" className="flex items-center">
        <div>
          <Text component="span" c={diff > 0 ? "teal" : "red"} fw={700}>
            {sign}
            {Math.abs(diff)}%
          </Text>{" "}
          compared to the last check
        </div>
        <ThemeIcon
          color="gray"
          variant="filled"
          size={"1.25em"}
          radius="md"
          className="ml-1"
        >
          <IconQuestionMark />
        </ThemeIcon>
      </Text>
    );
  }
};
