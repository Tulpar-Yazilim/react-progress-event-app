import React from "react";
import { Redirect } from "react-router-dom";
import { DefaultLayout } from "./layouts";
import ProgressAddPage from "./views/progress-add.page";
import ProgressListPage from "./views/progress-list.page";
import ProgressUpdatePage from "./views/progress-update.page";

const routes = [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/progress-list" />,
  },
  {
    path: "/progress-list",
    layout: DefaultLayout,
    component: ProgressListPage,
  },
  {
    path: "/progress-add",
    layout: DefaultLayout,
    component: ProgressAddPage,
  },
  {
    path: "/progress-update/:id",
    layout: DefaultLayout,
    component: ProgressUpdatePage,
  },
];

export default routes;
