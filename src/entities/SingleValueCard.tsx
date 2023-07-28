import {
  Group,
  Paper,
  Popover,
  Text,
  ThemeIcon,
  createStyles,
} from "@mantine/core";
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
  cacheDate?: string;
}

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
  },
}));

export const SingleValueCard: React.FC<Props> = ({
  diff,
  title,
  value,
  cacheDate,
}) => {
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
    return (
      <Text c="dimmed" fz="sm" mt="md" className="flex items-center">
        <div>{renderChange(diff)} compared to the last check</div>
        <ThemeIcon
          color="gray"
          variant="filled"
          size={"1.25em"}
          radius="md"
          className="ml-1"
        >
          {cacheDate && renderQuestionMark()}
        </ThemeIcon>
      </Text>
    );
  }

  function renderChange(value: number) {
    const sign = value > 0 ? "+" : value < 0 ? "-" : "";
    return (
      <Popover width={200} position="top" withArrow shadow="md">
        <Popover.Target>
          <Text
            component="span"
            c={value > 0 ? "teal" : "red"}
            fw={700}
            className="cursor-pointer"
          >
            {sign}
            {round(Math.abs(value))}%
          </Text>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="sm" color="white">
            {sign}
            {Math.abs(value)}%
          </Text>
        </Popover.Dropdown>
      </Popover>
    );
  }

  function renderQuestionMark() {
    return (
      <Popover width={200} position="bottom" withArrow shadow="md">
        <Popover.Target>
          <IconQuestionMark className="cursor-pointer" />
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="sm">Compared to {new Date(cacheDate!).toUTCString()}</Text>
        </Popover.Dropdown>
      </Popover>
    );
  }

  function round(value: number) {
    if (value >= 1) {
      return Math.round(value);
    }
    return value.toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)?.[0];
  }
};
