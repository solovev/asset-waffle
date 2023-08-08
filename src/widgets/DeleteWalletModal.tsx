import { useStaticDataContext } from "@/app/providers";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import React from "react";

interface Props {
  currentTab: string;
  className?: string;
}

export const DeleteWalletModal: React.FC<Props> = ({
  currentTab,
  className,
}) => {
  const theme = useMantineTheme();

  const { wallets, setWallets } = useStaticDataContext();
  const [opened, { open, close }] = useDisclosure(false);

  const handleDelete = () => {
    setWallets(wallets.filter((wallet) => wallet.address !== currentTab));
  };

  const wallet = wallets.find((wallet) => wallet.address === currentTab);

  React.useLayoutEffect(() => {
    if (!wallet) {
      close();
    }
  }, [wallet, close]);

  const label = wallet?.label || wallet?.address;

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Remove wallet"
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
      >
        <div>Are you sure you want to delete the "{label}" wallet?</div>
        {label !== wallet?.address && (
          <div>Address is: "{wallet?.address}"</div>
        )}
        <Group position="center" className="mt-5">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button onClick={handleDelete} leftIcon={<IconTrash size="1rem" />}>
            Delete
          </Button>
        </Group>
      </Modal>
      <ActionIcon onClick={open} className={className}>
        <IconTrash size="1rem" />
      </ActionIcon>
    </>
  );
};
