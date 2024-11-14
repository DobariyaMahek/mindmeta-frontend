import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

import { H6, Paragraph, Small } from "@/components/typography"; // COMMON STYLED COMPONENTS
import { ListItem } from "./Notifications";
import { FlexBox } from "@/components/flexbox";
import { Avatar } from "@mui/material";

export default function NotificationsDetails() {
  const msg = {
    id: "5e8883f7ed1486d665d8be1e",
    createdAt: Date.now(),
    description: "You have 32 unread messages",
    title: "New message received",
    type: "new_message",
    name: "Kiara Hamptoon",
    message:
      "Nice Work! You really nailed it. Keep it Up ManLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    image: "/static/avatar/002-girl.svg",
  };
  return (
    <Card>
      <Box padding={3}>
        <H6 fontSize={14}>Notification Details</H6>
      </Box>
      <Box padding={3}>
        <div className="notification-details-layout-main">
          <div className="notification-details-days-title">
            <H6 fontSize={14}>Today</H6>
          </div>
          <FlexBox
            p={2}
            gap={2}
            my={2}
            alignItems="center"
            sx={{
              borderBottom: 1,
              cursor: "pointer",
              borderColor: "divider",
              backgroundColor: "transparent",
            }}
          >
            <FlexBox alignItems="center">
              <Avatar
                src={msg.image}
                sx={{
                  width: 35,
                  height: 35,
                }}
              />
            </FlexBox>

            <div>
              <Paragraph fontWeight={500}>{msg.name}</Paragraph>
              <Small ellipsis color="text.secondary">
                {msg.createdAt}
              </Small>
            </div>
          </FlexBox>
          <Small ellipsis color="text.secondary">
            {msg.message}
          </Small>
        </div>
      </Box>
    </Card>
  );
}
