import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  Link,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";
import {
  Button as MuiButton,
  Typography,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import { theme } from "./theme";
import { AuthProvider, ProtectedRoute } from "./auth";
import { NoticeProvider, PageHeading, Loading } from "./components/ui";
import { Layout } from "./components/Layout";
const Landing = lazy(() =>
  import("./pages/Landing").then((module) => ({ default: module.Landing })),
);
const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login })),
);
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((module) => ({ default: module.Dashboard })),
);
const Contacts = lazy(() =>
  import("./pages/Contacts").then((module) => ({ default: module.Contacts })),
);
const ContactDetail = lazy(() =>
  import("./pages/Contacts").then((module) => ({
    default: module.ContactDetail,
  })),
);
const ImportContacts = lazy(() =>
  import("./pages/Import").then((module) => ({
    default: module.ImportContacts,
  })),
);
const Lists = lazy(() =>
  import("./pages/Lists").then((module) => ({ default: module.Lists })),
);
const ListDetail = lazy(() =>
  import("./pages/Lists").then((module) => ({ default: module.ListDetail })),
);
const Templates = lazy(() =>
  import("./pages/Templates").then((module) => ({ default: module.Templates })),
);
const TemplateEditor = lazy(() =>
  import("./pages/Templates").then((module) => ({
    default: module.TemplateEditor,
  })),
);
const Campaigns = lazy(() =>
  import("./pages/Campaigns").then((module) => ({ default: module.Campaigns })),
);
const CampaignWizard = lazy(() =>
  import("./pages/CampaignWizard").then((module) => ({
    default: module.CampaignWizard,
  })),
);
const CampaignDetail = lazy(() =>
  import("./pages/CampaignDetail").then((module) => ({
    default: module.CampaignDetail,
  })),
);
const Analytics = lazy(() =>
  import("./pages/Analytics").then((module) => ({ default: module.Analytics })),
);
const Settings = lazy(() =>
  import("./pages/Settings").then((module) => ({ default: module.Settings })),
);
const Unsubscribe = lazy(() =>
  import("./pages/Unsubscribe").then((module) => ({
    default: module.Unsubscribe,
  })),
);
function Providers() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NoticeProvider>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </NoticeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
function NotFound() {
  return (
    <>
      <PageHeading
        title="Page not found"
        description="This page may have moved, or the address may be incorrect."
      />
      <MuiButton component={Link} to="/dashboard">
        Back to dashboard
      </MuiButton>
    </>
  );
}
function RouteError() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <div className="page">
      <section className="panel route-error">
        <div className="error-code">
          <ErrorOutlineOutlined />
        </div>
        <Typography variant="h1">
          {notFound ? "Page not found" : "This page could not be loaded"}
        </Typography>
        <Typography color="text.secondary" sx={{ my: 2.2 }}>
          {notFound
            ? "The page may have moved or the address may be incorrect."
            : "An unexpected page error occurred. Your saved records remain on the server."}
        </Typography>
        <MuiButton component="a" href="/dashboard">
          Return to dashboard
        </MuiButton>
      </section>
    </div>
  );
}
export const routes = [
  {
    element: <Providers />,
    errorElement: <RouteError />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/landing", element: <Landing /> },
      { path: "/login", element: <Login /> },
      { path: "/unsubscribe/:token", element: <Unsubscribe /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />,
            children: [
              { path: "/dashboard", element: <Dashboard /> },
              { path: "/contacts", element: <Contacts /> },
              { path: "/contacts/import", element: <ImportContacts /> },
              { path: "/contacts/:id", element: <ContactDetail /> },
              { path: "/contact-lists", element: <Lists /> },
              { path: "/contact-lists/:id", element: <ListDetail /> },
              { path: "/templates", element: <Templates /> },
              { path: "/templates/create", element: <TemplateEditor /> },
              { path: "/templates/:id", element: <TemplateEditor /> },
              { path: "/campaigns", element: <Campaigns /> },
              { path: "/campaigns/create", element: <CampaignWizard /> },
              { path: "/campaigns/:id", element: <CampaignDetail /> },
              { path: "/campaigns/:id/analytics", element: <Analytics /> },
              { path: "/settings", element: <Settings /> },
              { path: "*", element: <NotFound /> },
            ],
          },
        ],
      },
    ],
  },
];
export default function App() {
  return <RouterProvider router={createBrowserRouter(routes)} />;
}
