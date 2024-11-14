import { useRef, useState } from "react"; // MUI

import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import RadioGroup from "@mui/material/RadioGroup"; // CUSTOM COMPONENTS

import Counter from "@/components/counter";
import ChevronDown from "@/icons/ChevronDown";
import Facebook from "@/icons/social/Facebook";
import Instagram from "@/icons/social/Instagram"; // STYLED COMPONENTS
import Carousel from "@/components/carousel";
import ColorRadio from "@/components/color-radio";
import FlexBox from "@/components/flexbox/FlexBox";
import { H2, H6, Paragraph } from "@/components/typography"; // CUSTOM ICON COMPONENTS

import Heart from "@/icons/Heart";
import Twitter from "@/icons/social/Twitter";

import { CarouselRoot, SlideThumb, StyledIconButton } from "./styles";
export default function ProductViewCard() {
  return (
    <>
      <Card
        sx={{
          padding: 2,
        }}
      >
        <H6 fontSize={16}>Call Details</H6>
        <div className="call-details">
        {/* <div className="call-details call-details-box-light"> */}
          <div className="call-details-box">
            <div className="call-details-box-text-alignment">
              <p>
                Title <b>:</b>
              </p>
              <span>Alen</span>
            </div>
            <div className="call-details-box-text-alignment">
              <p>
                Patient Name <b>:</b>
              </p>
              <span></span>
            </div>
            <div className="call-details-box-text-alignment">
              <p>
                Call Time <b>:</b>
              </p>
              <span></span>
            </div>
            <div className="call-details-box-text-alignment">
              <p>
                Call Duration <b>:</b>
              </p>
              <span></span>
            </div>
            <div className="call-details-box-text-alignment">
              <p>
                Description <b>:</b>
              </p>
              <span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequuntur aliquam facere expedita beatae quibusdam delectus
                officiis, quidem adipisci nobis earum cum labore in inventore.
                Vitae iure ullam quis sed deleniti.
              </span>
            </div>
          </div>
          {/* <div className="call-details-box">
            <p>
              Title: <span>Alen</span>
            </p>
            <p>
              Patient Name: <span></span>
            </p>
            <p>
              Call Time: <span></span>
            </p>
            <p>
              Call Duration: <span></span>
            </p>
            <p>
              Description: <span></span>
            </p>
          </div> */}
        </div>
      </Card>

      <FlexBox
        flexWrap="wrap"
        gap={2}
        sx={{
          my: 3,
        }}
      >
        <Button type="submit" variant="contained">
          Add
        </Button>

        <Button variant="outlined" color="secondary">
          Clear
        </Button>
      </FlexBox>
    </>
  );
}
