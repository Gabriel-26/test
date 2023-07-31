import type { ReactElement } from "react";
import { Paper, Box, Grid } from "@mui/material";
import PageContainer from "../../../src/components/container/PageContainer";
import DashboardCard from "../../../src/components/shared/DashboardCard";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import FullLayout from "../../../src/layouts/full/FullLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: "60px",
}));

const darkTheme = createTheme({ palette: { mode: "dark" } });
const lightTheme = createTheme({ palette: { mode: "light" } });

const Shadow = () => {
  return (
    <PageContainer title="Shadow" description="this is Shadow">
      <DashboardCard title="Shadow">
      <Tabs defaultValue="account" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">Patient Info</TabsTrigger>
    <TabsTrigger value="password">Patient History</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Make changes to your account here.</TabsContent>
  <TabsContent value="password">Change your password here.</TabsContent>
</Tabs>

      </DashboardCard>
    </PageContainer>
  );
};

export default Shadow;
Shadow.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
