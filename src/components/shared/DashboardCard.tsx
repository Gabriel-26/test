import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  useMediaQuery,
} from "@mui/material";

type Props = {
  title?: string;
  subtitle?: string;
  action?: JSX.Element | any;
  footer?: JSX.Element;
  cardheading?: string | JSX.Element;
  headtitle?: string | JSX.Element;
  headsubtitle?: string | JSX.Element;
  children?: JSX.Element | JSX.Element[];
  middlecontent?: string | JSX.Element;
  cardWidth?: number; // Add cardWidth prop here
};

const DashboardCard = ({
  title,
  subtitle,
  children,
  action,
  footer,
  cardheading,
  headtitle,
  headsubtitle,
  middlecontent,
  cardWidth,
}: Props) => {
  const isLargeScreen = useMediaQuery(
    (theme: { breakpoints: { up: (arg0: string) => string } }) =>
      theme.breakpoints.up("md")
  );
  const calculatedCardWidth = cardWidth ?? (isLargeScreen ? 1000 : 600);
  return (
    <>
      <Card
        sx={{ marginTop: 5, minWidth: calculatedCardWidth, minHeight: 100 }}
        elevation={9}
        variant={undefined}
      >
        {cardheading ? (
          <CardContent>
            <Typography variant="h5">{headtitle}</Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {headsubtitle}
            </Typography>
          </CardContent>
        ) : (
          <CardContent sx={{ p: "30px" }}>
            {title ? (
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                alignItems={"center"}
                mb={3}
              >
                <Box>
                  {title ? <Typography variant="h5">{title}</Typography> : ""}

                  {subtitle ? (
                    <Typography variant="subtitle2" color="textSecondary">
                      {subtitle}
                    </Typography>
                  ) : (
                    ""
                  )}
                </Box>
                {action}
              </Stack>
            ) : null}

            {children}
          </CardContent>
        )}

        {middlecontent}
        {footer}
      </Card>
    </>
  );
};

export default DashboardCard;
