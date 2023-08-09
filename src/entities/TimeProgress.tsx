import { Badge, Group, Progress, Text } from "@mantine/core";

interface Props {
  passed: number;
  total: number;
  mean?: boolean;
}

export const TimeProgress: React.FC<Props> = ({ passed, total, mean }) => {
  const progress = passed / total;
  const percent = progress * 100;

  const daysPassed = Math.round(passed / 60 / 60 / 24);
  const daysTotal = Math.round(total / 60 / 60 / 24);

  const done = progress >= 1;

  return (
    <div>
      <Group position="apart" mt="xs">
        <Text fz="sm" color="dimmed">
          Vesting period {mean ? '(mean)' : ''}
        </Text>
        <Text fz="sm" color="dimmed">
          {Math.floor(percent)}%
        </Text>
      </Group>
      <Progress value={percent} mt={5} color={done ? "teal" : "blue"} />
      <Group position="apart" mt="md">
        <Text fz="sm">
          {daysPassed} / {daysTotal} days
        </Text>
        <Badge size="sm" color={done ? "teal" : "blue"} variant="light">
          {done ? "Unlocked" : `${daysTotal - daysPassed} day(s) left`}
        </Badge>
      </Group>
    </div>
  );
};
