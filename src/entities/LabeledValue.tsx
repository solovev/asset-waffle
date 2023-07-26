import React from "react";

import { Text } from "@mantine/core";

interface Props {
  label: string;
  value: React.ReactNode;
  description?: string;
  className?: string;
}

export const LabeledValue: React.FC<Props> = ({
  label,
  value,
  description,
  className,
}) => {
  return (
    <div className={className}>
      <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
        {label}
      </Text>
      <Text size="xl">
        {value}
      </Text>
      <Text fz="xs" c="dimmed">
        {description && renderDescription()}
      </Text>
    </div>
  );

  function renderDescription() {
    return (
      <Text fz="xs" c="dimmed">
        {description}
      </Text>
    );
  }
};
