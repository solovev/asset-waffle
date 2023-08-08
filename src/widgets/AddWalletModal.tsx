import { useStaticDataContext } from "@/app/providers";
import { ActionIcon, Button, Group, Modal, TextInput, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import React from "react";

interface Props {
  openByDefault: boolean;
  className?: string;
}

export const AddWalletModal: React.FC<Props> = ({ openByDefault, className }) => {
  const theme = useMantineTheme();

  const { wallets, setWallets } = useStaticDataContext();
  const [opened, { open, close }] = useDisclosure(openByDefault);

  const [address, setAddress] = React.useState("");
  const [addressError, setAddressError] = React.useState("");
  const [label, setLabel] = React.useState("");

  const canClose = !openByDefault;

  const handleClickAdd = () => {
    setAddressError("");

    if (wallets.some((wallet) => wallet.address === address)) {
      return setAddressError("Address already exists");
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return setAddressError("Address is invalid");
    }

    setWallets([...wallets, { address, label }]);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Add a new wallet"
        withCloseButton={canClose}
        closeOnClickOutside={canClose}
        closeOnEscape={canClose}
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
      >
        <TextInput
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          label="Address"
          placeholder="0x"
          className="mb-3"
          withAsterisk
          error={addressError}
        />
        <TextInput
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          label="Label"
          className="mb-5"
          placeholder={address || "Main"}
        />
        <Group position="center">
          <Button onClick={handleClickAdd} leftIcon={<IconPlus size="1rem" />}>
            Add a wallet
          </Button>
        </Group>
      </Modal>
      <ActionIcon onClick={open} className={className}>
        <IconPlus size="1rem" />
      </ActionIcon>
    </>
  );
};
