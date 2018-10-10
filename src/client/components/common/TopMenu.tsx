import * as React from "react";
import { hot } from "react-hot-loader";
import { Container, Divider, Dropdown, Grid, Header, Image, List, Menu, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";

const TopMenuComponent: React.StatelessComponent<{}> = (props) => {
  return (
      <Menu fixed="top">
        <Container>
          <Menu.Item header>
            <Image
              size="mini"
              src="/public/images/logo.png"
              style={{ marginRight: "1.5em" }}
            />
            Homelab as a Service - Bootstrap
          </Menu.Item>
        </Container>
      </Menu>
  );
};

export const TopMenu = hot(module)(TopMenuComponent);
