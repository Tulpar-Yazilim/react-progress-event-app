import React from "react";
import { Nav } from "shards-react";

import UserActions from "./UserActions";

const navbar = () => (
  <Nav navbar className="border-left flex-row">
    <UserActions />
  </Nav>
);

export default navbar;
