import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody"; // MUI ICON COMPONENT

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown"; // CUSTOM COMPONENTS

import Link from "@/components/link";
import Scrollbar from "@/components/scrollbar";
import { H6, Paragraph, Small } from "@/components/typography"; // COMMON STYLED COMPONENTS

import NotificationsPopover from "@/layouts/layout-parts/popovers/NotificationsPopover"; // STYLED COMPONENTS
import { MESSAGES } from "../../../layouts/layout-parts/popovers/NotificationsPopover";
import Avatar from "@mui/material/Avatar";
import { FlexBox } from "@/components/flexbox";
import { NavLink } from "react-router-dom";

export default function Notifications() {
  return (
    <Card>
      <Box padding={3}>
        <H6 fontSize={14}>Notifications</H6>

        <Small color="text.secondary">
          We need permission from your browser to show notifications.{" "}
          <Link href="#">Request permission</Link>
        </Small>
      </Box>
      <Box padding={3}>
        {MESSAGES.length === 0 ? (
          <Paragraph fontWeight="500" textAlign="center" p={2}>
            There are no notifications
          </Paragraph>
        ) : (
          MESSAGES.map((msg) => <ListItem msg={msg} key={msg.id} />)
        )}
        {/* <div className="notification-layout-main">
          <div className="notification-days-title">
            <H6 fontSize={14}>Today</H6>
          </div>
          <div className="notification-ticket-main">
            <Box padding={3}>
              <div className="notification-ticket">
                <div className="notification-ticket-flx">
                  <div className="notification-ticket-icon">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                      alt="icon"
                    />
                  </div>
                  <div className="notification-title-and-description">
                    <H6 fontSize={14}>Eva adams</H6>
                    <Small color="text.secondary">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Facere quasi eaque ipsum rem cum, minima eum voluptatibus.
                      Esse illo eligendi, assumenda officiis voluptatem
                      voluptatibus dolorum cupiditate quae dolor quia.
                      Perspiciatis. Nisi facilis, corporis, at repudiandae iste
                      perspiciatis magnam, excepturi dolore eius iusto dolor hic
                      repellendus! Quidem voluptatibus consectetur tempore quae?
                      Quisquam qui necessitatibus facilis, eligendi deserunt
                      rerum quo explicabo tempore!
                    </Small>
                  </div>
                </div>
              </div>
              <div className="notification-ticket">
                <div className="notification-ticket-flx">
                  <div className="notification-ticket-icon">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                      alt="icon"
                    />
                  </div>
                  <div className="notification-title-and-description">
                    <H6 fontSize={14}>Eva adams</H6>
                    <Small color="text.secondary">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Facere quasi eaque ipsum rem cum, minima eum voluptatibus.
                      Esse illo eligendi, assumenda officiis voluptatem
                      voluptatibus dolorum cupiditate quae dolor quia.
                      Perspiciatis. Nisi facilis, corporis, at repudiandae iste
                      perspiciatis magnam, excepturi dolore eius iusto dolor hic
                      repellendus! Quidem voluptatibus consectetur tempore quae?
                      Quisquam qui necessitatibus facilis, eligendi deserunt
                      rerum quo explicabo tempore!
                    </Small>
                  </div>
                </div>
              </div>
              <div className="notification-ticket">
                <div className="notification-ticket-flx">
                  <div className="notification-ticket-icon">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                      alt="icon"
                    />
                  </div>
                  <div className="notification-title-and-description">
                    <H6 fontSize={14}>Eva adams</H6>
                    <Small color="text.secondary">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Facere quasi eaque ipsum rem cum, minima eum voluptatibus.
                      Esse illo eligendi, assumenda officiis voluptatem
                      voluptatibus dolorum cupiditate quae dolor quia.
                      Perspiciatis. Nisi facilis, corporis, at repudiandae iste
                      perspiciatis magnam, excepturi dolore eius iusto dolor hic
                      repellendus! Quidem voluptatibus consectetur tempore quae?
                      Quisquam qui necessitatibus facilis, eligendi deserunt
                      rerum quo explicabo tempore!
                    </Small>
                  </div>
                </div>
              </div>
              <div className="notification-ticket">
                <div className="notification-ticket-flx">
                  <div className="notification-ticket-icon">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                      alt="icon"
                    />
                  </div>
                  <div className="notification-title-and-description">
                    <H6 fontSize={14}>Eva adams</H6>
                    <Small color="text.secondary">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Facere quasi eaque ipsum rem cum, minima eum voluptatibus.
                      Esse illo eligendi, assumenda officiis voluptatem
                      voluptatibus dolorum cupiditate quae dolor quia.
                      Perspiciatis. Nisi facilis, corporis, at repudiandae iste
                      perspiciatis magnam, excepturi dolore eius iusto dolor hic
                      repellendus! Quidem voluptatibus consectetur tempore quae?
                      Quisquam qui necessitatibus facilis, eligendi deserunt
                      rerum quo explicabo tempore!
                    </Small>
                  </div>
                </div>
              </div>
            </Box>
          </div>
        </div> */}
      </Box>

      {/* <Scrollbar autoHide={false}>
        <Table sx={{
        minWidth: 600
      }}>
          <TableHead>
            <TableRow>
              <HeadTableCell>Type</HeadTableCell>
              <HeadTableCell>Email</HeadTableCell>
              <HeadTableCell>Browser</HeadTableCell>
              <HeadTableCell>App</HeadTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {NOTIFICATION_SETTINGS.map(item => <BodyTableRow key={item.id}>
                <BodyTableCell>{item.type}</BodyTableCell>

                <BodyTableCell>
                  <Checkbox defaultChecked={item.email} />
                </BodyTableCell>

                <BodyTableCell>
                  <Checkbox defaultChecked={item.browser} />
                </BodyTableCell>

                <BodyTableCell>
                  <Checkbox defaultChecked={item.app} />
                </BodyTableCell>
              </BodyTableRow>)}
          </TableBody>
        </Table>
      </Scrollbar>

      <Box padding={3}>
        <Box mb={6} mt={2}>
          <TextField select fullWidth value="always" variant="outlined" placeholder="Language" label="When should we send you notifications?" slotProps={{
          select: {
            native: true,
            IconComponent: KeyboardArrowDown
          }
        }} sx={{
          maxWidth: 400
        }}>
            <option value="always">Always</option>
          </TextField>

          <Paragraph color="text.secondary" mt={2}>
            In order to cut back on noise, email notifications are grouped together and only sent
            when you're idle or offline.
          </Paragraph>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button variant="contained">Save Changes</Button>
          <Button variant="outlined">Cancel</Button>
        </Stack>
      </Box> */}
    </Card>
  );
}

export function ListItem({ msg, key }) {
  const isNew = msg.type === "new_message";
  return (
    <NavLink to={`/dashboard/account?tab=Notifications&id=${msg?.id}`}>
      <FlexBox
        p={2}
        gap={2}
        alignItems="center"
        sx={{
          borderBottom: 1,
          cursor: "pointer",
          borderColor: "divider",
          backgroundColor: isNew ? "action.hover" : "transparent",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <FlexBox alignItems="center">
          <Box
            sx={{
              width: 8,
              height: 8,
              marginRight: 2,
              borderRadius: "50%",
              backgroundColor: isNew ? "primary.main" : "grey.400",
            }}
          />
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
            {msg.message}
          </Small>
        </div>
      </FlexBox>
    </NavLink>
  );
}
